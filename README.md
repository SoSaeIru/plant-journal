# 식물 관찰 일기

아이들이 직접 쓰는 식물 관찰 일기 웹앱입니다. 서버 없이 기기 안(IndexedDB)에만 저장하고, 인터넷이 없어도 열립니다.

## 파일 구성
| 파일 | 하는 일 |
|---|---|
| `index.html` | 앱 화면과 동작 전부 |
| `styles.css` | **자동 생성 파일.** `index.html`에 쓰인 Tailwind 클래스만 모은 스타일 |
| `sw.js` | 서비스 워커. 한 번 열면 인터넷 없이도 열리게 함 (`VERSION`, `ASSETS`는 자동으로 채워짐) |
| `fonts/` | Jua 글꼴 (SIL Open Font License, `fonts/OFL.txt`) |
| `vendor/` | canvas-confetti 1.6.0 (ISC License) |
| `build.mjs`, `tailwind.config.js`, `src/tailwind.css`, `package.json` | `styles.css`를 만들고 버전 번호를 붙이는 도구 |

## 고친 뒤 꼭 할 일
`index.html`을 고쳤으면 올리기 전에 아래를 실행합니다.

```
npm install      # 처음 한 번
npm run build
```

- **새 Tailwind 클래스**(예: `text-purple-600`)를 쓰고 빌드하지 않으면, 그 스타일은 적용되지 않습니다.
- 빌드하면 파일 주소에 버전 번호(`?v=…`)가 붙고 `sw.js`가 바뀝니다. 그래서 폰에 새 버전이 바로 반영됩니다.
- GitHub 웹사이트에서 `index.html`만 직접 올리면 이 과정이 빠집니다. 문구만 바꿀 때는 괜찮지만, 클래스를 바꿨다면 빌드가 필요합니다.

## 데이터 주의
- 기록에 저장되는 값(성장 단계, 관찰 선택지, 해준 일 문구)은 바꾸지 않습니다. 바꾸면 예전 기록이 제대로 표시되지 않습니다.
- 아이폰·아이패드는 **홈 화면 앱과 사파리가 저장 공간을 따로 씁니다.** 홈 화면 아이콘을 지우거나 다시 추가하기 전에 ⚙️ 어른 메뉴 → 📦 전체 백업을 받아 두세요.
