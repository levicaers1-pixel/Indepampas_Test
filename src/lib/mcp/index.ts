import { defineMcp } from "@lovable.dev/mcp-js";
import searchCourses from "./tools/search-courses";
import getCourseRating from "./tools/get-course-rating";
import listEpisodes from "./tools/list-episodes";

export default defineMcp({
  name: "pampas-golf-hub",
  title: "PAMPAS Golf Hub",
  version: "0.1.0",
  instructions:
    "Public tools for the PAMPAS golf podcast site. Use `search_courses` to find golf courses in the PAMPAS database (Belgium, the Netherlands and more) with host scores, `get_course_rating` for the full review of one course, and `list_episodes` for the podcast episodes.",
  tools: [searchCourses, getCourseRating, listEpisodes],
});
