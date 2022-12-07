
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
