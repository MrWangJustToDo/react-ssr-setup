import { useIntl } from "react-intl";

export const I18n = () => {
  const { formatMessage: f } = useIntl();
  return (
    <div>
      aaaa
      <p>{f({ id: "app.title", defaultMessage: "hello" })}</p>
      <p>{f({ id: "home.lead", defaultMessage: "test" })}</p>
      <p>{f({ id: "home.title", defaultMessage: "title" })}</p>
    </div>
  );
};

export default I18n;
