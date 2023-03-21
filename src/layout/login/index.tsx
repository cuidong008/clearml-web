import { useCallback, useState } from "react";
import styles from "./index.module.scss";
import { GetAccessToken, UserCredentials } from "@/api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, message } from "antd";

export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation().state?.location ?? "/";

  const handleLogin = useCallback(
    (form: UserCredentials) => {
      setLoading(true);
      GetAccessToken({
        username: form.username,
        password: form.password,
      })
        .then(({ data }) => {
          document.cookie = `access_token=${data.access_token}`;
          localStorage.setItem("authTk", data.access_token);
          setError(undefined);
          message.success(
            location === "/"
              ? "登录成功，即将跳转到主页..."
              : "登录成功，即将返回之前页面..."
          );
          setTimeout(() => {
            navigate(location);
          }, 1000);
        })
        .catch((err) => {
          if (err.response?.data?.detail) {
            setError(err.response.data.detail);
          } else {
            setError(String(err));
          }
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [location, navigate]
  );

  return (
    <div className={styles.container}>
      <Card
        className={styles.card}
        title="OA 账户登录"
        loading={loading}
        bordered
      >
        <Form
          initialValues={{ username: "", password: "" }}
          onFinish={handleLogin}
          aria-errormessage={error}
        >
          <Form.Item
            label="账户"
            name="username"
            wrapperCol={{ offset: 0 }}
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            wrapperCol={{ offset: 0 }}
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 0 }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
        {error && (
          <span className={styles.errorMessage}>
            {error.length ? error : "未知错误"}
          </span>
        )}
      </Card>
    </div>
  );
}
