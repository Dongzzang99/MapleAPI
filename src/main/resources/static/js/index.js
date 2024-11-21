
//캐릭터 고유키 get 함수
function getCharOcid(urlString){
    //api를 header로 보냄
    fetch(urlString)
      .then(response => {
        console.log(response);
        return response.json()
        })
      .then(data => {
        console.log(data);
        const resultDiv = document.getElementById('charInfo');
        resultDiv.innerText = JSON.stringify(data, null, 2);
      })
      .catch(error => console.log("error"+ error))
}

//제출시 실행 함수
document.getElementById('characterForm').addEventListener('submit', function(event) {
    event.preventDefault();

//    캐릭터 이름 받아오기
    const characterName = document.getElementById('characterName').value;
//    uri로 캐릭터 이름 넘겨주기
    const urlString = `/api/searchCharacter?characterName=${encodeURIComponent(characterName)}`;

    getCharOcid(urlString);
});




