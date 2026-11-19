"""Create bundled Arabic MP3 clips; no runtime TTS service is needed by the game."""
import asyncio
import hashlib
import json
from pathlib import Path
import subprocess
import sys
import time

import edge_tts
from gtts import gTTS

ROOT = Path(__file__).resolve().parent
TEXTS = json.loads((ROOT / 'arabic-audio-texts.json').read_text())
OUTPUT = Path(sys.argv[1] if len(sys.argv) > 1 else 'arabic-audio')
OUTPUT.mkdir(parents=True, exist_ok=True)


def inspect(path):
    result = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(path)], check=True, capture_output=True, text=True)
    duration = float(json.loads(result.stdout)['format']['duration'])
    if duration < .2 or path.stat().st_size < 800:
        raise ValueError('Empty or too-short audio: ' + str(path))
    return round(duration, 3)


async def main():
    voice = None
    try:
        available = await asyncio.wait_for(edge_tts.list_voices(), 20)
        matches = [v for v in available if v['Locale'] == 'ar-SA' and v['Gender'] == 'Female']
        if not matches:
            matches = [v for v in available if v['Locale'].startswith('ar-')]
        if matches:
            voice = matches[0]['ShortName']
    except Exception as error:
        print('Voice discovery unavailable; using Arabic MP3 fallback:', type(error).__name__, flush=True)

    async def edge_save(text, path):
        await asyncio.wait_for(edge_tts.Communicate(text, voice=voice, rate='-15%').save(str(path)), 35)

    # Probe once, rather than repeating an unavailable service on every item.
    if voice:
        try:
            await edge_save(TEXTS[0], OUTPUT / 'probe.mp3')
            inspect(OUTPUT / 'probe.mp3')
        except Exception as error:
            print('Neural voice unavailable; using Arabic MP3 fallback:', type(error).__name__, flush=True)
            voice = None
        finally:
            (OUTPUT / 'probe.mp3').unlink(missing_ok=True)

    records = {}
    # Sequential requests avoid bursts against public speech services.
    for index, text in enumerate(TEXTS, 1):
        filename = hashlib.sha256(text.encode()).hexdigest()[:16] + '.mp3'
        path = OUTPUT / filename
        error = None
        for attempt in range(4):
            try:
                if voice:
                    await edge_save(text, path)
                else:
                    await asyncio.to_thread(gTTS(text=text, lang='ar', slow=False, timeout=(10, 30)).save, str(path))
                duration = inspect(path)
                records[text] = {'file': filename, 'duration': duration}
                error = None
                break
            except Exception as failure:
                error = failure
                path.unlink(missing_ok=True)
                await asyncio.sleep(2 ** attempt)
        if error:
            raise RuntimeError(f'Clip {index} failed: {type(error).__name__}: {error}')
        print(f'{index}/{len(TEXTS)} audio ready ({duration}s)', flush=True)
        await asyncio.sleep(.25)

    manifest = {'version': 1, 'language': 'ar', 'provider': 'Microsoft Edge neural speech' if voice else 'Google Arabic speech', 'voice': voice, 'clips': records}
    (OUTPUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(f'Completed {len(records)} Arabic MP3 clips.', flush=True)


asyncio.run(main())
