import React, { useState } from 'react';
import { Button, Grid, Paper, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: 'auto',
  maxWidth: 300,
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNumberClick = (num: string) => {
    setDisplay(prev => (prev === '0' ? num : prev + num));
  };

  const handleOperationClick = (op: string) => {
    if (firstOperand === null) {
      setFirstOperand(parseFloat(display));
      setOperation(op);
      setDisplay('0');
    } else {
      handleEqualsClick();
      setOperation(op);
    }
  };

  const handleEqualsClick = async () => {
    if (firstOperand !== null && operation) {
      setLoading(true);
      try {
        const result = await backend.calculate(operation, firstOperand, parseFloat(display));
        setDisplay(result.toString());
        setFirstOperand(null);
        setOperation(null);
      } catch (error) {
        setDisplay('Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearClick = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperation(null);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    'C', '0', '=', '+'
  ];

  return (
    <CalculatorPaper elevation={3}>
      <TextField
        fullWidth
        variant="outlined"
        value={display}
        InputProps={{
          readOnly: true,
        }}
        sx={{ marginBottom: 2 }}
      />
      <Grid container spacing={1}>
        {buttons.map((btn) => (
          <Grid item xs={3} key={btn}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                if (btn === 'C') handleClearClick();
                else if (btn === '=') handleEqualsClick();
                else if (['+', '-', '*', '/'].includes(btn)) handleOperationClick(btn);
                else handleNumberClick(btn);
              }}
              disabled={loading}
            >
              {btn}
            </Button>
          </Grid>
        ))}
      </Grid>
      {loading && <CircularProgress sx={{ marginTop: 2 }} />}
    </CalculatorPaper>
  );
};

export default App;
