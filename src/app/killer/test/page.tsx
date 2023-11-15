import { api } from 'trpc/server';

const corpsIds = [
  'cld099pna01uxzhvdgs1u95oc',
  'cld099pnh027nzhvd802ie87p',
  'cld099pni028dzhvd6mvbaft2',
  'cld099pnh0277zhvd2ar05avy',
  'clls3axo6006hqhpzldh7s4jd',
  'cld099png026fzhvd6rdrd5ey',
  'cld099pnd022xzhvdg34qg632',
  'cld099pnb01x1zhvdhw763yfh',
  'cld099pnc020pzhvd07z50eew',
  'cld099pnh026rzhvd6nrw3zhm',
  'cld099png026dzhvde4f6cv08',
];

const KillerTestPage = async () => {
  // const game = await api.killer.create.mutate({
  //   name: 'Test Game 3',
  //   start: new Date(),
  //   end: dayjs().add(1, 'week').toDate(),
  //   participants: corpsIds,
  // });

  await api.killer.kill.mutate({
    word: 'potato',
  });

  const game = await api.killer.get.query({});

  return (
    <div className='flex flex-col'>
      {game?.participants.map((p) => {
        return (
          <div key={p.id} className='flex flex-row gap-4'>
            <div>{p.id}</div>
            <div>{p.corps.fullName}</div>
            <div>{p.word}</div>
            <div>{p.wordEnglish}</div>
            <div>{p.targetId}</div>
            <div>{p.timeOfDeath?.toISOString()}</div>
            <div>{p.killedById}</div>
          </div>
        );
      })}
    </div>
  );
};

export default KillerTestPage;
