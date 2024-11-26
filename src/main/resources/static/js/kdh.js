//제출시 실행 함수
document.getElementById('characterForm').addEventListener('submit', function (event) {
    event.preventDefault();

//    캐릭터 이름 받아오기
    const characterName = document.getElementById('characterName').value;
//    uri로 캐릭터 이름 넘겨주기
    const urlString = `/api/searchCharacter?characterName=${encodeURIComponent(characterName)}`;



    getCharOcid(urlString)
        .then(ocid => {
            console.log("OCID:", ocid);
            return getCharInfo(ocid); // getCharInfo 호출
        })
        .catch(error => {
            console.error("Error in submission process:", error);
        });
});

// 캐릭터 고유키를 가져오는 함수
async function getCharOcid(urlString) {
    try {
        const response = await fetch(urlString); // fetch의 결과를 기다림
        const data = await response.json(); // JSON으로 변환 완료까지 기다림
        return data.ocid; // ocid 값을 반환
    } catch (error) {
        console.error("Error in getCharOcid:", error);
        throw error; // 호출한 함수로 에러 전달
    }
}



// 저장된 ocid 값을 컨트롤러로 전달
async function getCharInfo(ocid) {
    try {
        //get 방식으로 ocid값 전달
        //urlString 처럼 전역변수로 선언하는 방법ㅠ?
        const response = await fetch(`/api/useOcid?ocid=${encodeURIComponent(ocid)}`, {
                    method: 'GET',
                });
        const result = await response.json(); // 컨트롤러의 응답 처리


        // 특정 값을 하나하나 따로 가져오기
        result.final_stat.forEach(stat => {
            console.log(`${stat.stat_name}: ${stat.stat_value}`);
        });
        // 특정 값만 출력하고 싶을 경우 (예: 데미지)
        const damageStat = result.final_stat.find(stat => stat.stat_name === "데미지");
        if (damageStat) {
            console.log(`damage: ${damageStat.stat_value}`);
        }

         const characterInfoDiv = document.getElementById('character-info');

                // 캐릭터 클래스 이름 추가
                const characterClass = document.createElement('h2');
                characterClass.textContent = `캐릭터 직업: ${result.character_class}`;
                characterInfoDiv.appendChild(characterClass);

                // 스탯 정보 추가
                result.final_stat.forEach(stat => {
                    const statElement = document.createElement('div');
                    statElement.classList.add('stat');
                    statElement.textContent = `${stat.stat_name}: ${stat.stat_value}`;
                    characterInfoDiv.appendChild(statElement);
                });


        console.log("캐릭터 정보 결과값:", result.final_stat_);
    } catch (error) {
        console.error("Error:", error);
    }
}