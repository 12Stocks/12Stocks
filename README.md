- [x] 회원정보조회
- [x] 주식 정보 크롤링
- [ ] 주식 조회

### Authentication & Session

express-session과 passport.js middleware를 사용  
routing 이름 변경 : login -> auth  

~~임시 test용 계정~~  
~~id : team12~~  
~~password : 1234~~  

~~로그인 실패시 flash module을 사용하여 실패 사유를 하단에 확인할 수 있게 하였습니다.~~  
~~["Incorrect username.", "Incorrect password."]~~  

로그인 성공시 navbarTop에 로그인 버튼 대신 로그아웃 버튼이 생김  
로그 아웃 기능 구현  

[TODO]
1. session data mysql 저장
2. 현재 로그인된 사용자의 username 출력
2. Sign Up Form 제작

### Signup Form  

Sign Up Form 제작, 비밀 번호 중복 체크 기능 구현  

계정 생성에 성공하였을 경우  
1. mysql에 저장됨 -> 회원 조회에서 확인할 수 있음  
2. 로그인 상태로 전환  
3. 로그 아웃 버튼 왼쪽에 현재 사용자 id를 확인할 수 있음  

mysql에 등록된 사용자만 로그인이 가능
로그인 실패시 하단에 "Incorrect Information" messege를 띄움


