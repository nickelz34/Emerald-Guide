import type { GuideSection } from "../types";
import guideDataJson from "./guide_data.json";

/** Live walkthrough source of truth (bundled from guide_data.json). */
export const walkthrough = guideDataJson.walkthrough as GuideSection[];
