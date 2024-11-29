package MapleAPI.Maple_Api.Controller.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;


@RestController
public class ljhController {


    private static final String API_KEY = "live_ffad0c71b122257961b4ea0a8c596998a97b4b49a1fc8e84ce0fe4eee56decc38aecd546f3deb031c4102ab7e560094d";
    private static final String NEXON_API_URL = "https://open.api.nexon.com/maplestory/v1/";

    @Autowired
    private WebClient webClient;

    @GetMapping("/api/getCharInfo")
    // Mono(WebClient에서 사용 0 또는 1 개의 값을 가짐. 비동기식 처리에 용이)
    // 1개 이상일 때는 flux(0개 이상의 데이터)를 사용함
    public Mono<ResponseEntity<String>> getCharacterInfo(@RequestParam String ocid) {
        System.out.println("ocdi: " + ocid);
        // 비동기 GET 요청(get()으로 값 받음)
        return webClient.get()
                // 해당 url로 정보 요청
                .uri(NEXON_API_URL+"character/basic?ocid=" + ocid)
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


    @GetMapping("/api/getCashItemInfo")
    // Mono(WebClient에서 사용 0 또는 1 개의 값을 가짐. 비동기식 처리에 용이)
    // 1개 이상일 때는 flux(0개 이상의 데이터)를 사용함
    public Mono<ResponseEntity<String>> getCashItemInfo(@RequestParam String ocid) {
        System.out.println("ocdi: " + ocid);
        // 비동기 GET 요청(get()으로 값 받음)
        return webClient.get()
                // 해당 url로 정보 요청
                .uri(NEXON_API_URL+"character/cashitem-equipment?ocid=" + ocid)
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

    @GetMapping("/api/getPopularity")
    // Mono(WebClient에서 사용 0 또는 1 개의 값을 가짐. 비동기식 처리에 용이)
    // 1개 이상일 때는 flux(0개 이상의 데이터)를 사용함
    public Mono<ResponseEntity<String>> getPopularity(@RequestParam String ocid) {
        System.out.println("ocdi: " + ocid);
        // 비동기 GET 요청(get()으로 값 받음)
        return webClient.get()
                // 해당 url로 정보 요청
                .uri(NEXON_API_URL+"character/popularity?ocid=" + ocid)
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

    // 헤어, 성형, 피부 가져옴
    @GetMapping("/api/getBeautyEquip")
    // Mono(WebClient에서 사용 0 또는 1 개의 값을 가짐. 비동기식 처리에 용이)
    // 1개 이상일 때는 flux(0개 이상의 데이터)를 사용함
    public Mono<ResponseEntity<String>> getBeautyEquip(@RequestParam String ocid) {
        System.out.println("ocdi: " + ocid);
        // 비동기 GET 요청(get()으로 값 받음)
        return webClient.get()
                // 해당 url로 정보 요청
                .uri(NEXON_API_URL+"character/beauty-equipment?ocid=" + ocid)
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
