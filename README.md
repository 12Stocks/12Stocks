### Forums Backend  
  
const MAX_POST_LENGTH = 2;  
const PAGE_WINDOW_LENGTH = 3;  

forumController 모듈에서  
MAX_POST_LENGTH : 한 페이지에 보여지는 게시글의 개수   
PAGE_WINDOW_LENGTH : 한번에 이동할 수 있는 페이지 개수  
  
최근 게시글 순으로 정렬됨  
Index Page에서 게시판을 공지사항으로 바꾸고 종목 페이지에서  
토론 게시판 버튼을 클릭해 게시판 페이지로 이동  
비회원이거나 자신이 작성한 게시글이 아닐 경우 글 수정 버튼 비활성화   

### Order Backend  
- Order  
  주문 창에서 정보들을 입력  
  [Example]  
  
  ![image](https://user-images.githubusercontent.com/80976609/205973147-37dd4fd2-b2fd-4905-a35f-190b68cd0c6c.png)    
  
- Conclusion  
  - [x] 지정가 주문  
    지정한 수량과 가격으로 주문을 진행 시 DB의 주문 정보들 중 조건에 맞는 주문들을 불러온 후 채결을 진행  
    채결이 진행된 후 잔량이 있다면 잔량만큼만 주문을 넣어 DB에 주문정보를 저장   
  
  - [x] 시장가 주문  
    시장가 주문은 가격은 입력이 불가능하고 수량만 입력이 가능    
    입력된 수량을 매수/매도 주문 중 우선 순위에 따라 채결을 진행  
  
- Holding  
  채결 정보가 DB에 들어오면 해당되는 유저의 보유 주식을 갱신  
  판매자 => 보유 주식 수--,   총 금액--  
  구매자 => 보유 주식 수++,   총 금액++  

- getOrderList  
  - [x] Conclusion List  
    주문 시 채결된 내역들을 웹에 띄워 실시간으로 갱신  

  - [x] Not Conclusion Order List  
    주문 후 아직 채결이 진행되지 않은 내역들을 갱신 

### Holdings Page  

- get Holdings  
  DB에서 현재 로그인 된 유저가 보유한 주식 목록들을 가져옴  

- Update
  주가 변동에 따른 변동률을 실시간으로 갱신  
  서버에서 DB에 1분 주기로 현재주가 갱신

[TODO]  
- [x] get holdings
- [x] update periodically