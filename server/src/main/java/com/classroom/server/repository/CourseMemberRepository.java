    package com.classroom.server.repository;

    import com.classroom.server.entity.Course;
    import com.classroom.server.entity.CourseMember;
    import com.classroom.server.entity.CourseRole;
    import com.classroom.server.entity.User;
    import org.springframework.data.jpa.repository.JpaRepository;

    import java.util.List;
    import java.util.Optional;

    public interface CourseMemberRepository extends JpaRepository<CourseMember, Long> {

        Optional<CourseMember> findByCourseAndUser(Course course, User user);

        List<CourseMember> findByUser(User user);

        List<CourseMember> findByUserAndRole(User user, CourseRole role);

        List<CourseMember> findByCourse(Course course);
    }
