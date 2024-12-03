package MapleAPI.Maple_Api.Controller.RestController;

import MapleAPI.Maple_Api.Entity.JobsMainStat;
import MapleAPI.Maple_Api.Entity.Stats;
import MapleAPI.Maple_Api.Repository.JobsMainStatRepository;
import MapleAPI.Maple_Api.Repository.JobsRepository;
import MapleAPI.Maple_Api.Repository.StatsRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@Slf4j
public class ohrController {
    String equiUri = "https://open.api.nexon.com/maplestory/v1/character/";
    // API_KEY
    @Value("${api.nexon.key}")
    private String API_KEY;
    @Autowired
    private WebClient webClient;
    @Autowired
    private JobsMainStatRepository jmsRepository;
    @Autowired
    private JobsRepository jobsRepository;
    @Autowired
    private StatsRepository statsRepository;

    // 캐릭터 장비 정보 들고오기
    @GetMapping("/api/characterEquipment")
    public Mono<ResponseEntity<String>> getEquiments(@RequestParam String ocid){
        log.info("캐릭터 장비 정보 들고오기");
        return webClient.get()
                // 해당 url로 정보 요청
                .uri(equiUri+"item-equipment?ocid=" + ocid)
                // 보낼 해더값 설정
                .header("x-nxopen-api-key", API_KEY)
                // 응답 받아서 응답 처리
                .retrieve()
                // 받아온 정보를 String타입으로 변경
                // .class가 붙는 이유는 제네릭 타입을 지정해 줘야만 한기 때문이라고 함(공부 더 해봐야 할 듯..ㅠ)
                .bodyToMono(String.class)
                // 응답 값 출력
                //.doOnNext(response -> System.out.println("응답 값: " + response))
                // 결과를 ResponseEntity타입으로 변형해 결과 확인
                .map(response -> ResponseEntity.ok(response));
    }


    // 캐릭터 직업 정보를 받아서 주스텟 가져오기
    @GetMapping("/api/class/mainStat")
       public List<String> getMainStats(@RequestParam  String jobName){
         // 직업 이름을 가져와서 해당하는 J_id값 Jobs에서 가져오기
         String job_Id = jobsRepository.findByName(jobName).orElse(null);
         log.info("job_Id"+ job_Id);
        // J_id 값을 사용하여 JobsMainStat 테이블에서 주스탯 S_id값 가져오기
        List<JobsMainStat> mainStatList = jmsRepository.findByJobId(job_Id);
        log.info("mainStatList" + mainStatList);
        // 해당하는 주스탯들의 s_id만 담는 리스트 선언
        List<String> statIds = mainStatList.stream()
                .map(JobsMainStat::getStatId) // statId 추출
                .collect(Collectors.toList());
        log.info("statIds" + statIds);


        //리스트인 statIds을 사용하여  Stats 테이블에서 스탯명 가져오기
        List<Stats> statsList = statsRepository.findAllById(statIds);
        log.info("statsList" + statsList);

        //스탯명만 추출해서 가져오기
        // 스탯명만 추출
        List<String> mainStatNameList = statsList.stream()
                .map(Stats::getStatName) // Getter 메서드로 접근
                .collect(Collectors.toList());
        log.info("statNameList" + mainStatNameList);

           return mainStatNameList;
      }



}

