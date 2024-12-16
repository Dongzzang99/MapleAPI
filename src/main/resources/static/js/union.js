//제출시 실행 함수
document.getElementById('characterForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    //    캐릭터 이름 받아오기
    const characterName = document.getElementById('characterName').value;
    //    uri로 캐릭터 이름 넘겨주기
    const urlString = `/api/searchCharacter?characterName=${encodeURIComponent(characterName)}`;
    // 비동기 처리로 ocid 값을 가져오기
    try {
        // 검색한 캐릭터 식별값 가져오기
        const ocid = await getCharOcid(urlString);
        const unionBasic = await getUnionBasic(ocid);
    } catch (error) {
       // console.error("Error fetching OCID:", error);
    }
});

async function getUnionBasic(ocid){
    try {
        const unionUrlString = `/api/union/basic?ocid=${ocid}`;
        const response = await fetch(unionUrlString); // fetch의 결과를 기다림
        const unionBasic = await response.json(); // JSON으로 변환 완료까지 기다림
        //console.log("getUnionBasic",unionBasic);
        return unionBasic
    } catch (error) {
       // console.error("Error in getCharOcid:", error);
        throw error; // 호출한 함수로 에러 전달
    }
}

function renderUnionInfo(unionBasic){
    //아티팩트 정보 담을 div 박스
    const unionArtifactDiv = document.createElement("div");
    unionArtifactDiv.id = "unionArtifactDiv";

    //유니온 공격대 정보 담을 div박스

}