# 손글씨 숫자 인식 AI

이 프로젝트는 사용자가 캔버스에 마우스로 직접 쓴 손글씨 숫자를 인공지능이 인식하여 어떤 숫자인지 맞추는 웹 애플리케이션입니다. 모든 AI 연산은 사용자의 브라우저에서 직접 실행되므로 별도의 서버나 설치 과정이 필요 없습니다.

## ✨ 주요 기능

- **실시간 숫자 인식**: 캔버스에 숫자를 그리면 AI 모델이 즉시 분석하고 예측 결과를 보여줍니다.
- **브라우저 기반 AI**: TensorFlow.js를 사용하여 모든 머신러닝 연산이 사용자의 브라우저에서 직접 실행됩니다.
- **직관적인 UI**: 사용자가 쉽게 숫자를 그리고, 지우고, 인식 결과를 확인할 수 있는 깔끔한 인터페이스를 제공합니다.
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 등 다양한 기기에서 최적화된 화면을 제공합니다.

---

## 🚀 사용 방법

1.  웹사이트에 접속합니다.
2.  화면 중앙에 있는 검은색 캔버스 영역에 마우스(또는 터치)로 숫자 **0부터 9까지** 중 하나를 그립니다.
3.  **[인식하기]** 버튼을 클릭합니다.
4.  잠시 후, 오른쪽에 AI가 예측한 숫자와 신뢰도(Confidence)가 표시됩니다.
5.  다시 그리려면 **[지우기]** 버튼을 클릭하여 캔버스를 초기화할 수 있습니다.

---

## 🔧 기술 스택

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **Machine Learning**: TensorFlow.js

---

## 💡 GitHub Pages 배포를 위해 고려한 점

이 프로젝트는 별도의 빌드 과정 없이 GitHub Pages와 같은 정적 호스팅 환경에서 바로 실행될 수 있도록 설계되었습니다. 이를 위해 다음과 같은 점들을 특별히 고려했습니다.

1.  **서버 없는(Serverless) 구조**:
    -   모든 기능(숫자 그리기, AI 모델 예측 등)은 100% 사용자의 웹 브라우저 안에서만 동작합니다. 따라서 복잡한 백엔드 서버를 구축하거나 관리할 필요가 없습니다.

2.  **CDN을 통한 라이브러리 로딩**:
    -   `index.html` 파일에서 React, TensorFlow.js와 같은 핵심 라이브러리들을 `npm install` 과정 없이 CDN(Content Delivery Network)을 통해 직접 불러옵니다. 이는 사용자가 웹사이트에 접속했을 때 브라우저가 필요한 파일들을 가장 빠른 경로에서 다운로드할 수 있게 해줍니다.

    ```html
    <!-- index.html -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
    ```

3.  **CORS 문제없는 공개 모델 사용**:
    -   AI가 사용하는 MNIST 손글씨 숫자 모델은 Google이 제공하는 공개 스토리지 URL에서 직접 불러옵니다.
    -   이렇게 하면 다른 도메인에서 리소스를 요청할 때 발생할 수 있는 CORS(Cross-Origin Resource Sharing) 헤더 관련 오류를 원천적으로 방지할 수 있습니다. GitHub Pages(`*.github.io`)에서 Google 스토리지(`storage.googleapis.com`)의 모델을 문제없이 가져올 수 있는 이유입니다.

    ```typescript
    // services/mnistService.ts
    const MODEL_URL = 'https://storage.googleapis.com/tfjs-examples/mnist/model.json';
    ```

4.  **브라우저 모듈 시스템 활용**:
    -   `index.html`의 `<script type="module">`과 `importmap`을 사용하여 별도의 번들링 도구(Webpack, Vite 등) 없이도 최신 JavaScript 모듈 시스템을 브라우저에서 직접 실행할 수 있도록 구성했습니다. 이는 코드를 단순하게 유지하고 GitHub에 올린 파일 그대로를 서비스할 수 있게 해줍니다.
