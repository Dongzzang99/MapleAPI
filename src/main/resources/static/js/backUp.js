// 제출 시 실행 함수
    document.getElementById('characterForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // 캐릭터 이름 받아오기
    const characterName = document.getElementById('characterName').value;
    // URI로 캐릭터 이름 넘겨주기
    const urlString = `/api/searchCharacter?characterName=${encodeURIComponent(characterName)}`;

    // OCID를 가져온 후 통합 함수 호출
    getCharOcid(urlString)
        .then(ocid => {
            console.log("OCID:", ocid); // OCID 확인
            return displayCharacterInfo(ocid); // 통합 함수 호출
        })
        .catch(error => {
            console.error("Error:", error);
        });
});

// 캐릭터 고유키(OCID)를 가져오는 함수
async function getCharOcid(urlString) {
    try {
        const response = await fetch(urlString); // fetch의 결과를 기다림
        const data = await response.json(); // JSON으로 변환 완료까지 기다림
        return data.ocid; // ocid 값을 반환
    } catch (error) {
        console.error("Error:", error);
        throw error; // 호출한 함수로 에러 전달
    }
}

// OCID를 이용해 JSON 데이터를 가져오고 화면에 렌더링하는 함수
async function displayCharacterInfo(ocid) {
    try {
        const characterData = await getCharStat(ocid); // 데이터를 가져옴
        console.log("characterData 값:", characterData); // 디버깅 로그
        renderCharStat(characterData); // 화면에 렌더링
    } catch (error) {
        console.error("Error in displayCharacterInfo:", error);
    }
}

// OCID 값을 전달해서 JSON 데이터를 가져오는 함수
async function getCharStat(ocid) {
    try {
        const response = await fetch(`/api/useOcid?ocid=${encodeURIComponent(ocid)}`, {
            method: 'GET',
        });
        const result = await response.json(); // JSON 데이터를 JavaScript 객체로 변환
        //console.log("API:", result); // API 결과 확인
        return result;
    } catch (error) {
        console.error("Error:", error);
        return null; // 에러 발생 시 null 반환
    }
}


function renderCharStat(characterData) {
    if (!characterData) {
        console.error("캐릭터 정보가 없습니다!");
        return;
    }

    // 화면 초기화
    const characterInfoDiv = document.getElementById("character-info");
    console.log(characterInfoDiv);
    //characterInfoDiv.innerHTML = "";

    // 전투력 표시
    const totalPowerStat = characterData.final_stat.find(stat => stat.stat_name === '전투력');
    const totalPower = totalPowerStat ? totalPowerStat.stat_value : '0';
    const totalPowerElement = document.createElement('h2'); // h2 요소 생성
    totalPowerElement.textContent = `전투력: ${formatNumber(totalPower)}`;
    totalPowerElement.style.backgroundColor = '#455F74'; // 남색 배경
    totalPowerElement.style.color = 'white'; // 흰색 텍스트
    totalPowerElement.style.padding = '15px';
    totalPowerElement.style.borderRadius = '10px'; // 둥근 테두리
    totalPowerElement.style.textAlign = 'center'; // 중앙 정렬
    totalPowerElement.style.marginBottom = '20px';
    characterInfoDiv.appendChild(totalPowerElement);

    // 주요 스탯 (STR, INT, DEX, LUK, HP, MP) 표시
    const mainStats = ['STR', 'INT', 'DEX', 'LUK', 'HP', 'MP'];
    const mainStatsContainer = createStatContainer(mainStats, characterData, '#88929D'); // 연한 회색 배경
    characterInfoDiv.appendChild(mainStatsContainer);

    // 나머지 스탯 표시
    const statNames = [
        "데미지", "보스 몬스터 데미지", "최종 데미지", "방어율 무시",
        "공격력", "마력", "크리티컬 확률", "크리티컬 데미지",
        "재사용 대기시간 감소 (초)", "재사용 대기시간 감소 (%)", "버프 지속시간",
        "재사용 대기시간 미적용", "속성 내성 무시",
        "스타포스", "아케인포스", "어센틱포스"
    ];

    const otherStats = characterData.final_stat.filter(stat =>
        statNames.includes(stat.stat_name) && !mainStats.includes(stat.stat_name)
    );

    const otherStatsContainer = createStatContainer(otherStats, characterData, '#6D7784'); // 진한 회색 배경
    characterInfoDiv.appendChild(otherStatsContainer);
}

// 컨테이너를 생성하는 함수
function createStatContainer(statList, characterData, backgroundColor) {
    const chatContainer = document.createElement('div');
    chatContainer.style.display = 'flex';
    chatContainer.style.flexWrap = 'wrap'; // 두 열로 나뉨
    chatContainer.style.backgroundColor = backgroundColor;
    chatContainer.style.padding = '8px'; // 내부 패딩
    chatContainer.style.borderRadius = '10px'; // 둥근 테두리
    chatContainer.style.marginBottom = '10px'; // 컨테이너 간의 간격 최소화

    statList.forEach(stat => {
        const statElement = document.createElement('div');
        const statData = typeof stat === 'string'
            ? characterData.final_stat.find(data => data.stat_name === stat)
            : stat; // 주요 스탯과 나머지 스탯 처리 분리
        const statValue = statData ? statData.stat_value : '0';

        statElement.style.display = 'flex';
        statElement.style.justifyContent = 'space-between'; // 이름 왼쪽, 값 오른쪽
        statElement.style.alignItems = 'center';
        statElement.style.flex = '50%'; // 세로 기준 반으로 나뉘게 설정
        statElement.style.color = 'white'; // 흰색 텍스트
        statElement.style.padding = '4px'; // 내부 패딩을 줄임
        statElement.style.margin = '1px 0'; // 네모 간의 간격을 줄임

        statElement.innerHTML = `<span>${statData.stat_name}</span><span>${statValue}</span>`;
        chatContainer.appendChild(statElement);
    });

    return chatContainer;
}

// 숫자를 억/만 단위로 포맷팅하는 함수
function formatNumber(num) {
    if (!num || isNaN(num)) return "0";
    num = Number(num); // 문자열을 숫자로 변환
    if (num >= 1e8) {
        const 억 = Math.floor(num / 1e8);
        const 만 = Math.floor((num % 1e8) / 1e4);
        const 나머지 = num % 1e4;
        return `${억}억 ${만}만 ${나머지}`;
    } else if (num >= 1e4) {
        const 만 = Math.floor(num / 1e4);
        const 나머지 = num % 1e4;
        return `${만}만 ${나머지}`;
    } else {
        return num.toString(); // 만 단위 이하 숫자 그대로 반환
    }
}