//케릭터 고유번호로 기본정보 받아오기

function getCharBasic(urlString, ocid){
//    uri 넘겨주기
    const urlString = `/api/searchCharBasic?charOcid=${encodeURIComponent(ocid)}`;

    fetch(urlString)
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log(data);
        const resultDiv = document.getElementById('charInfo');
        resultDiv.innerText = JSON.stringify(data, null, 2);
      })
      .catch(error => console.log("에러: " + error))


}