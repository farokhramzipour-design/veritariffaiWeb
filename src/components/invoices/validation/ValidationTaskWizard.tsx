import {
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import type { ValidationTaskOut } from '@app/invoices';

type Props = {
  tasks: ValidationTaskOut[];
  onResolveTask: (task: ValidationTaskOut) => void;
};

function statusTone(status: string) {
  return status.toLowerCase() === 'resolved' ? 'success' : 'warning';
}

export default function ValidationTaskWizard({ tasks, onResolveTask }: Props) {
  if (!tasks.length) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Typography>No validation tasks pending.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h6">Validation Tasks</Typography>
          <Stepper orientation="vertical">
            {tasks.map((task) => (
              <Step key={task.id} active={task.status.toLowerCase() !== 'resolved'}>
                <StepLabel>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>{task.task_type}</Typography>
                    <Chip
                      size="small"
                      label={task.status}
                      color={statusTone(task.status) as 'success' | 'warning'}
                    />
                  </Stack>
                </StepLabel>
                <Stack spacing={1} sx={{ pl: 2 }}>
                  <Typography color="text.secondary">
                    {task.payload ? JSON.stringify(task.payload) : 'Requires additional input.'}
                  </Typography>
                  {task.status.toLowerCase() !== 'resolved' && (
                    <Button size="small" variant="contained" onClick={() => onResolveTask(task)}>
                      Resolve task
                    </Button>
                  )}
                </Stack>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </CardContent>
    </Card>
  );
}
