import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  const data = [];
  for (let i = 0; i < 100; i++) data.push(<div key={i}>Hello</div>);
  return <main>{data}</main>;
}
