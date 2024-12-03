package MapleAPI.Maple_Api.Repository;

import MapleAPI.Maple_Api.Entity.JobsMainStat;
import MapleAPI.Maple_Api.Entity.Stats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StatsRepository extends JpaRepository<Stats, String> {

}
