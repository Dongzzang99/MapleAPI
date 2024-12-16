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


        const skillProgressContainer = document.createElement('div');
        skillProgressContainer.className = 'progress-container';

        const skillProgress = document.createElement('progress');
        skillProgress.max = 30;
        skillProgress.value = skill.skill_level;
        skillProgress.className = 'skill-progress';

        const skillProgressText = document.createElement('span');
        skillProgressText.textContent = `${skill.skill_level} / 30`;
        skillProgressText.className = 'progress-text';

        skillProgressContainer.appendChild(skillProgress);
        skillProgressContainer.appendChild(skillProgressText);
        skillContainer.appendChild(skillProgressContainer);

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

// 스타일 속성을 적용하며 요소를 생성하는 함수
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