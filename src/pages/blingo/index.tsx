import { Box, Button, Title } from '@mantine/core';
import React from 'react';
import { trpc } from '../../utils/trpc';
import BingoEntryForm from '../../components/blingo/entry-form';
import BingoCard from '../../components/blingo/card';

const Bingo = () => {
  const utils = trpc.useContext();
  const { data: card } = trpc.bingo.getCard.useQuery();

  const [loading, setLoading] = React.useState(false);

  const generateCard = trpc.bingo.generateCard.useMutation({
    onSuccess: () => {
      utils.bingo.getCard.invalidate();
      setLoading(false);
    },
  });

  return (
    <Box sx={{ maxWidth: '800px' }}>
      <Title order={2}>Blingo™</Title>
      {card && <BingoCard card={card} />}
      <BingoEntryForm />
      {!card && (
        <Button
          onClick={async () => {
            setLoading(true);
            await generateCard.mutateAsync();
          }}
        >
          Skapa bricka
        </Button>
      )}
    </Box>
  );
};

export default Bingo;
