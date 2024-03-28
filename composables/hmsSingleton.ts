import type { HmsInstance } from "~/types";
let hmsInstance: HmsInstance | null = null;

export function getHmsInstance(): HmsInstance {
    if (hmsInstance === null) {
      console.log("Creating a new instance of useHms");
      hmsInstance = useHms();
    } else {
      console.log("Reusing existing instance of useHms");
    }
    return hmsInstance;
  }
