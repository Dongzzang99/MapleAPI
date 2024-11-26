
//캐릭터별 고유 ocid
let ocid = "";

//제출시 실행 함수
document.getElementById('characterForm').addEventListener('submit', function(event) {
    event.preventDefault();

//    캐릭터 이름 받아오기
    const characterName = document.getElementById('characterName').value;
//    uri로 캐릭터 이름 넘겨주기
    const urlString = `/api/searchCharacter?characterName=${encodeURIComponent(characterName)}`;
    getCharOcid(urlString);
});


//이중 fetch를 위해서 getCharOcid함수를 들고가되, 주석처리 해놓고 사용하기
//캐릭터 고유키 get 함수
function getCharOcid(urlString){
    //api를 header로 보냄
    fetch(urlString)
      .then(response => response.json())
      .then(data => {
       window.ocid = data.ocid;
       console.log(data.ocid);
      })
      .catch(error => console.log("error"+ error))
}








