package MapleAPI.Maple_Api.Repository;

import MapleAPI.Maple_Api.Entity.Jobs;
import MapleAPI.Maple_Api.Entity.JobsMainStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobsRepository  extends JpaRepository<Jobs, String> {
    @Query("SELECT j.id FROM Jobs j WHERE j.jobName = :jobName") // 이 구문에 들어가는것은 엔티티 클래스를 참고할것
    Optional<String> findByName(@Param("jobName") String jobName);
}
