
### Recent Items  
  
const MAX_RECENT_ITEMS = 5;  
  
최대 MAX_RECENT_ITEMS 개수만큼 최근 조회한 종목을 cookie에 저장  
이미 cookie값에 저장된 종목의 경우 다시 최상단으로 이동
index page에서 리스트로 확인할 수 있으며 각 종목을 클릭하면 종목 페이지로 이동할 수 있게 함  
  
[Considerations]  
  
index page 뿐만 아니라 시장이나 종목 상세보기 페이지에서도   
가장 최근에 조회한 종목 리스트를 확인할 수 있도록 템플릿화  
  
