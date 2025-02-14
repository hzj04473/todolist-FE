## todolist-FE

## 0214 FE

- 카카오톡 로그인
- 프로젝트 발표자료 작성

## 0212 FE

- 다른 페이지 Helmet metatag 수정
- 검색 페이지 작업
  - 검색 요청 작업
  - 검색 성공시 URL 변경 /search/검색어
  - 투두 리스트에 검색 결과값 나오는 영역 추가 작업
  - 검색 완료 후 helmet 메타 태그 수정
- 링크 href -> Link 로 수정
- Link 수정 후 모바일에서 오른쪽 사이드 메뉴 안 닫히는 오류
  - Offcanvas 사용으로 오류 수정
- 네비게이션 상단 고정
- Ai Prompt 영역 - 타이틀 및 텍스트 크기 수정
- favison.io 수정
- og: 태그 수정
  - sns 공유시 이미지 작업

## 0210 FE

- 회원정보 수정
- 수정시 비밀번호 체크

## 0206 FE

- 메뉴에 회원 이름 나오게 수정
- task 각각 하단 삭제 / 완료 버튼 크기 변경

## 0205 FE

- 로그아웃 (작업완료)

## 0204 FE

- 회원권한 나누기 (작업완료)
- 로그인이 되었다면 리다이렉트 (작업완료)

## 0203 FE

- 로그아웃 (작업중)
- 회원권한 나누기 (작업중)
- 로그인이 되었다면 리다이렉트 (작업중)
- 제미니가 추천해 주는 동기유발 문구 view
- 할일에 리스트 카드형으로 수정
- 네비게이션 작업

## 0202 FE

- Session Storage
- 회원가입
- 로그인

## 0131 FE

- pages 폴더에 TodoPage.js, LoginPage.js, RegisterPage.js 생성
- react-router-dom install
- 기존 app.js 에 있던 task 입력/리스트 페이지 -> pages 폴더로 이동
- 할일 일자 입력폼 연견

## 0128 FE

- netlify - 1차 배포
- Helmet - SSO 관련

## 0127 FE

- useEffect, useCallBack 사용
- 자식페이지에서 onClick 으로 isComplete(update), delete 함수를 사용하고자 하면, 해당 함수를 부모페이지에서
  - props로 자식페이지로 전달을 해줘야 합니다. - redux 사용이 필요함
- useEffect 를 사용 최초 데이터를 [] 사용 로딩시 한번만 불러오게 한다.
