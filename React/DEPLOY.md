# Netlify 배포 가이드

## 🚀 배포 방법

### 방법 1: 드래그앤드롭 (가장 간단)

1. **빌드 파일 확인**
   ```bash
   # React 폴더에 dist 폴더가 생성되어 있어야 함
   ls /Users/mingyeonghyeon/Aje/React/dist
   ```

2. **Netlify에 배포**
   - [app.netlify.com/drop](https://app.netlify.com/drop) 접속
   - GitHub 계정으로 로그인
   - `dist` 폴더를 브라우저에 드래그앤드롭
   - 즉시 배포 완료!

### 방법 2: GitHub 연동 (자동 배포)

1. **GitHub에 푸시**
   ```bash
   cd /Users/mingyeonghyeon/Aje
   git add .
   git commit -m "Netlify 배포 설정 완료"
   git push origin main
   ```

2. **Netlify에서 GitHub 연결**
   - [app.netlify.com](https://app.netlify.com) 접속
   - "New site from Git" 클릭
   - GitHub 저장소 선택
   - Build settings:
     - Build command: `cd React && npm run build`
     - Publish directory: `React/dist`

## 📋 애드센스 설정

배포 완료 후 다음 정보를 업데이트하세요:

1. **퍼블리셔 ID 교체**
   - `index.html`의 `ca-pub-여기에_귀하의_퍼블리셔_ID`
   - `App.jsx`의 `ca-pub-여기에_귀하의_퍼블리셔_ID`

2. **광고 슬롯 ID 교체**
   - `App.jsx`의 `여기에_광고_슬롯_ID`

## ✅ 배포 완료 체크리스트

- [ ] 빌드 성공 (`npm run build`)
- [ ] dist 폴더 생성 확인
- [ ] Netlify 드래그앤드롭 배포
- [ ] 사이트 정상 작동 확인
- [ ] 애드센스 ID 업데이트 (선택사항)
