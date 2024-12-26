document.getElementById('characterForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const characterName = document.getElementById('characterName').value;
    const urlString = `/api/searchCharacter?characterName=${encodeURIComponent(characterName)}`;

    try {
        const ocid = await fetchData(urlString, "ocid");
        console.log("OCID:", ocid);

        //캐릭터 스텟 api 요청
        const characterData = await fetchData(`/api/useOcid?ocid=${encodeURIComponent(ocid)}`);
        renderCharacterInfo(characterData);
        console.log("캐릭터 스텟",characterData);

        //캐릭터 스킬 강화 정보 (6차) api 요청
        const characterSkillData = await fetchData(`/api/getskillicon?ocid=${encodeURIComponent(ocid)}`);
        renderCharacterSkills(characterSkillData);
        console.log(characterSkillData);

        //캐릭터 hexaStat 강화 정보 api 요청
        const hexaStatData = await fetchData(`/api/hexamatrix-stat?ocid=${encodeURIComponent(ocid)}`);
        //renderCharacterSkills(hexaStatData);
        console.log(hexaStatData);
    } catch (error) {
        console.error("Error:", error);
    }
});

// 공통 데이터 fetch 함수
async function fetchData(url, key) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return key ? data[key] : data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

// 캐릭터 정보를 렌더링하는 함수
function renderCharacterInfo(characterData) {
    if (!characterData) {
        console.error("캐릭터 정보가 없습니다!");
        return;
    }

    const characterInfoDiv = document.getElementById("character-info");
    characterInfoDiv.innerHTML = ""; // 기존 내용을 초기화

    // 전투력 표시
    const totalPowerStat = characterData.final_stat.find(stat => stat.stat_name === '전투력');
    const totalPower = totalPowerStat ? totalPowerStat.stat_value : '0';
    appendStyledElement(characterInfoDiv, 'h2', `전투력: ${formatNumber(totalPower)}`, {
        backgroundColor: '#455F74',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        textAlign: 'center',
        marginBottom: '20px',
    });

    // 주요 스탯 표시
    const mainStats = ['STR', 'INT', 'DEX', 'LUK', 'HP', 'MP'];
    const mainStatsContainer = createStatContainer(mainStats, characterData, '#88929D');
    characterInfoDiv.appendChild(mainStatsContainer);

    // 나머지 스탯 표시
    const statNames = [
        "데미지", "보스 몬스터 데미지", "최종 데미지", "방어율 무시",
        "공격력", "마력", "크리티컬 확률", "크리티컬 데미지",
        "재사용 대기시간 감소 (초)", "재사용 대기시간 감소 (%)", "버프 지속시간",
        "재사용 대기시간 미적용", "속성 내성 무시",
        "스타포스", "아케인포스", "어센틱포스"
    ];
    const otherStatsContainer = createStatContainer(
        characterData.final_stat.filter(stat => statNames.includes(stat.stat_name)),
        characterData,
        '#6D7784'
    );
    characterInfoDiv.appendChild(otherStatsContainer);
}

//5차 강화 솔에르다 조각 계산
function soleErdaPiece5th(currentLevel, inputLevel) {

    const soleerdaFragments = [
     0,4,1,1,1,2,2,2,3,3,8,
    3,3,3,3,3,3,3,3,4,
    12,4,4,4,4,4,5,5,5,6,15
    ];


    // 솔 에르다 조각 데이터 (0레벨부터 30레벨까지)
    const erdaFragments = [
        0,75, 23, 27, 30, 34, 38, 42, 45, 49, 150,
        60, 68, 75, 83, 90, 98, 105, 113, 120, 263,
        128, 135, 143, 150, 158, 165, 173, 180, 188, 375
    ];



    // 현재 레벨부터 입력한 레벨까지 필요한 에르다 계산
    const totalsoleerdaFragments = soleerdaFragments.slice(currentLevel+1, inputLevel + 1).reduce((sum, value) => sum + value, 0);
    // 현재 레벨부터 입력한 레벨까지 필요한 조각 계산
    const totalFragments = erdaFragments.slice(currentLevel+1, inputLevel + 1).reduce((sum, value) => sum + value, 0);
     return { totalFragments, totalsoleerdaFragments };

}
console.log("5차 강화 솔에르다 Test: ",soleErdaPiece5th(1, 30));


// 캐릭터 스킬 정보를 렌더링하는 함수
function renderCharacterSkills(characterSkillData) {
    if (!characterSkillData) {
        console.error("캐릭터 스킬 정보가 없습니다!");
        return;
    }

    const characterInfoDiv = document.getElementById('characterSkill-info');
    characterInfoDiv.innerHTML = ""; // 기존 내용을 초기화

    characterSkillData.character_skill.forEach(skill => {
        const skillContainer = document.createElement('div');
        skillContainer.className = 'skill-container';

        appendStyledElement(skillContainer, 'img', '', {
            src: skill.skill_icon,
            alt: skill.skill_name,
            className: 'skill-icon',
        });

        appendStyledElement(skillContainer, 'h5', skill.skill_name, {
            className: 'skill-name',
        });

        appendStyledElement(skillContainer, 'p', `레벨: ${skill.skill_level}`, {
            className: 'skill-level',
        });

        //각 스킬칸 마다 만들어지는 div
        const skillProgressContainer = document.createElement('div');
        skillProgressContainer.className = 'progress-container';

        const skillProgress = document.createElement('progress');
        skillProgress.max = 30;
        skillProgress.value = skill.skill_level;
        skillProgress.className = 'skill-progress';

        //목표 레벨 입력 칸
        const skillProgressText = document.createElement('input');
        skillProgressText.value = `${skill.skill_level}`;
        skillProgressText.className = 'progress-levelInput';//'progress-text' -> 'progress-levelInput' 변경

        //조각 결과 값 나오는 p 공간 생성
        const piecedisplayValue = document.createElement('p');
        piecedisplayValue.textContent = "0";
        // skillProgressContainer에 p 태그 추가

        //조각 결과 값 나오는 p 공간 생성
        const displayValue = document.createElement('p');
        displayValue.textContent = "0";
        // skillProgressContainer에 p 태그 추가

        //실시간으로 input 값 확인
        skillProgressText.addEventListener('input', () => {
            const currentLevel = parseInt(skill.skill_level, 10);
            const goalLevel = parseInt(skillProgressText.value, 10); // 실시간으로 값 읽기
            if (!isNaN(goalLevel)) {
                const { totalFragments } =soleErdaPiece5th(currentLevel,goalLevel);
                const { totalsoleerdaFragments } =soleErdaPiece5th(currentLevel,goalLevel);

                displayValue.textContent =`${totalsoleerdaFragments}`;
                piecedisplayValue.textContent =`${totalFragments}`;
            } else { //1~30 까지의 값이 아니먄 x를 표현합니다.
                displayValue.textContent = piecedisplayValue.textContent = "X";
            }
        });



        //솔 에르다 이미지 넣기
        const sole_erda = document.createElement('img');
        sole_erda.src= 'img/sole_erda.png';
        sole_erda.className="sole_erda_img"

        const sole_erda_piece = document.createElement('img');
          sole_erda_piece.src= 'img/sole_erda_piece.png';
          sole_erda_piece.className="sole_erda_img"




        skillProgressContainer.appendChild(skillProgress);
        skillProgressContainer.appendChild(skillProgressText);
        skillContainer.appendChild(skillProgressContainer);
        //솔에르다 이미지
        skillProgressContainer.appendChild(sole_erda);
        skillProgressContainer.appendChild(displayValue);
        skillProgressContainer.appendChild(sole_erda_piece);
        skillProgressContainer.appendChild(piecedisplayValue);// 필요한 조각 값 띄우기
        characterInfoDiv.appendChild(skillContainer);
    });
}

// 컨테이너를 생성하는 함수
function createStatContainer(statList, characterData, backgroundColor) {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexWrap = 'wrap';
    container.style.backgroundColor = backgroundColor;
    container.style.padding = '8px';
    container.style.borderRadius = '10px';
    container.style.marginBottom = '10px';

    statList.forEach(stat => {
        const statData = typeof stat === 'string'
            ? characterData.final_stat.find(data => data.stat_name === stat)
            : stat;
        const statValue = statData ? statData.stat_value : '0';

        appendStyledElement(container, 'div', `<span>${statData.stat_name}</span><span>${statValue}</span>`, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: '50%',
            color: 'white',
            padding: '4px',
            margin: '1px 0',
        });
    });

    return container;
}

// 숫자를 억/만 단위로 포맷팅하는 함수
function formatNumber(num) {
    if (!num || isNaN(num)) return "0";
    num = Number(num);
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
        return num.toString();
    }
}

// 스타일 속성을 적용하며 요소를 생성하는 함수 (수정 예정)
function appendStyledElement(parent, tagName, textContent = '', styles = {}) {
    const element = document.createElement(tagName);
    if (textContent) element.innerHTML = textContent;

    for (const [key, value] of Object.entries(styles)) {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'src' || key === 'alt') {
            element[key] = value;
        } else {
            element.style[key] = value;
        }
    }
    parent.appendChild(element);
}