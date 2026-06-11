# Chinese Noodle

Premium Traditional Chinese restaurant website for a Chaozhou noodle concept.

The opening experience uses a scroll-controlled frame sequence extracted from the source video:

- `frames/noodle/frame_0001.jpg` through `frame_0101.jpg`
- Scroll progress maps directly to the current frame
- Chinese four-character phrases are kept on one line with `white-space: nowrap`

## Run

```bash
python -m http.server 3002
```

Then open `http://127.0.0.1:3002`.
