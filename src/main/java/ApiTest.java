//import java.io.BufferedReader;
//import java.io.InputStreamReader;
//import java.net.HttpURLConnection;
//import java.net.URL;
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//
//public class  ApiTest {
//    public static void main(String[] args) {
//        try {
//            String API_KEY = "live_ffad0c71b122257961b4ea0a8c596998a97b4b49a1fc8e84ce0fe4eee56decc38aecd546f3deb031c4102ab7e560094d";
//            String characterName = URLEncoder.encode("헌란", StandardCharsets.UTF_8);
//
//            String urlString = "https://open.api.nexon.com/heroes/v1/id?character_name=" + "헌란";
//            URL url = new URL(urlString);
//
//            HttpURLConnection connection = (HttpURLConnection)url.openConnection();
//            connection.setRequestMethod("GET");
//            connection.setRequestProperty("x-nxopen-api-key", API_KEY);
//
//            int responseCode = connection.getResponseCode();
//
//            BufferedReader in;
//            if(responseCode == 200) {
//                in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
//            } else {
//                in = new BufferedReader(new InputStreamReader(connection.getErrorStream()));
//            }
//
//            String inputLine;
//            StringBuffer response = new StringBuffer();
//            while ((inputLine = in.readLine()) != null) {
//                response.append(inputLine);
//            }
//            in.close();
//
//            System.out.println(response.toString());
//        } catch (Exception exception) {
//            System.out.println(exception);
//        }
//    }
//}