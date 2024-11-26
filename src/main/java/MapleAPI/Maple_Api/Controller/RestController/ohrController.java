package MapleAPI.Maple_Api.Controller.RestController;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@Slf4j
public class ohrController {
    String equiUri = "https://open.api.nexon.com/maplestory/v1/character/";
    // API_KEY
    @Value("${api.nexon.key}")
    private String API_KEY;
    @Autowired
    private WebClient webClient;

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
                .doOnNext(response -> System.out.println("응답 값: " + response))
                // 결과를 ResponseEntity타입으로 변형해 결과 확인
                .map(response -> ResponseEntity.ok(response));
    }


}

