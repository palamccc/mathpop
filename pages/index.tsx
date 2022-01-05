import { LinkButton } from '../components/buttons';

export default function Home() {
  return (
    <div className="flex flex-col justify-center h-screen p-4 space-y-4">
      <div className="text-center text-indigo-600" style={{ fontFamily: 'Monoton', fontSize: 50 }}>
        MathPop
      </div>
      <LinkButton url="/maths-test">Maths test</LinkButton>
    </div>
  );
}
