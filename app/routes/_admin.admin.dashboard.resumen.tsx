import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Visits" },
    { name: "description", content: "Tabla de visitas" },
  ];
};

export default function DashboardPAge() {
  return (
    <div className="w-full flex justify-center">
      <h1>aa</h1>
    </div>
  );
}
