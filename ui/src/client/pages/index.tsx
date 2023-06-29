import { Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router";

export default function Index() {
  const navigate = useNavigate();
  return (
    <>
      <Heading>hello home page</Heading>
      <br />
      {/* <div bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600" text="sm white" font="mono light" p="y-2 x-4" m="l-1em" border="2 rounded blue-200">
        12
      </div> */}
      {/* <div className="w-[100px] h-[200px] border rounded">12</div> */}
      {/* <div className="w-[200px] border border-red">222</div> */}
      {/* <div className="h-[100px] border-pink border">4444</div> */}
      <Button onClick={() => navigate("/Foo")}>goto foo</Button>
      <Button onClick={() => navigate("/Bar")}>goto bar</Button>
      <Button onClick={() => navigate("/Baz")}>goto baz</Button>
      <Button onClick={() => navigate(`/Dynamic/${Math.random().toString().slice(2)}`)}>goto dynamic</Button>
      <Button onClick={() => navigate("/newDir")}>goto newDir/index</Button>
      <Button onClick={() => navigate("/I18n")}>goto i18n</Button>
      <Button onClick={() => navigate("/Goo")}>goto Goo</Button>
      <Button onClick={() => navigate("/HHH")}>404 page</Button>
    </>
  );
}

export const isStatic = true;
