package MapleAPI.Maple_Api.Repository;


import MapleAPI.Maple_Api.Entity.JobsMainStat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobsMainStatRepository extends JpaRepository<JobsMainStat, Integer> {
    List<JobsMainStat> findByJobId(String jobId);
}
