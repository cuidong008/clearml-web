import logo from "@/assets/icons/c-logo.svg";
import { connect } from "react-redux";
import styles from "./index.module.scss";

const Logo = (props: any) => {
  const { sidebarCollapsed, themeConfig } = props;
  return (
    <div
      className={styles.logoBox}
      style={{ background: themeConfig.isDark ? "#00001f" : "#2c3246" }}
    >
      <img src={logo} alt="logo" className={styles.logoImg} />
      {!sidebarCollapsed ? (
        <h2 className={styles.logoText}>Deekeeper</h2>
      ) : null}
    </div>
  );
};

const mapStateToProps = (state: any) => state.app;
export default connect(mapStateToProps)(Logo);
