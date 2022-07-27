import { Button, Heading } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router";

export default function Index() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet title="SSR Template" />
      <Heading>hello home page</Heading>
      <br />
      <Button onClick={() => navigate("/Foo")}>goto foo</Button>
      <Button onClick={() => navigate("/Bar")}>goto bar</Button>
      <Button onClick={() => navigate("/Baz")}>goto baz</Button>
      <Button onClick={() => navigate("/I18n")}>goto i18n</Button>
      <Button onClick={() => navigate("/HHH")}>404 page</Button>
    </>
  );
}
