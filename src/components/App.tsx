import { useDeferredValue, useState } from "react";
import styles from "../styles/App.module.scss";
import PackageCard, { VersionFilter } from "./PackageCard";

import { PackageIdentifier, packages } from "../PackageDescription";
import NavBar, { NavPivotItem } from "./NavBar";
import {
  blackTheme,
  darkTheme,
  lightTheme,
  whiteTheme,
} from "../styles/Themes";
import { ThemeProvider } from "@fluentui/react";

import type {} from "react/experimental";
import usePersistentState from "../hooks/usePersistentState";

const navItems: NavPivotItem<VersionFilter>[] = [
  { label: "Major", key: "major" },
  { label: "Patch", key: "patch" },
  { label: "Prerelease", key: "prerelease" },
];

function App() {
  const [versionFilter, setVersionFilter] = useState<VersionFilter>("major");
  const [darkMode, setDarkMode] = usePersistentState(
    "App.darkMode",
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const deferredVersionFilter = useDeferredValue(versionFilter);

  return (
    <ThemeProvider
      theme={darkMode ? blackTheme : lightTheme}
      className={styles.app}
    >
      <NavBar
        items={navItems}
        selectedItem={versionFilter}
        onItemSelected={(version) => setVersionFilter(version)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        theme={darkMode ? blackTheme : lightTheme}
      />

      <div className={styles.contentContainer}>
        <div className={styles.cardContainer}>
          {Object.keys(packages).map((pkg) => (
            <PackageCard
              identifier={pkg as PackageIdentifier}
              versionFilter={deferredVersionFilter}
              key={pkg}
              theme={darkMode ? darkTheme : whiteTheme}
              tooltipTheme={darkMode ? blackTheme : lightTheme}
              maxVersionsShown={
                deferredVersionFilter === "major"
                  ? 10
                  : deferredVersionFilter === "patch"
                  ? 12
                  : 8
              }
            />
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
