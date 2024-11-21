//케릭터 고유번호로 기본정보 받아오기

function getCharBasic(urlString, ocid){
//    uri 넘겨주기
    const urlString = `/api/searchCharBasic?charOcid=${encodeURIComponent(ocid)}`;

    fetch(urlString)
      .then(response => {
      })
}