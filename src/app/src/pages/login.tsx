import { Box, Button, Center, Grid, Group, Paper, PasswordInput, PinInput, ThemeIcon, Title } from '@mantine/core';
import { IconArrowBarRight, IconLock, IconLockOpen } from '@tabler/icons-react';

export default function LoginPage() {
  return <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', justifyContent: 'center' }}>
    <Center style={{}}>
      <Paper w={400} mx='lg'>

        <Paper withBorder bg='dark.6'>
          <Grid>
            <Grid.Col span={'auto'}>
              <PasswordInput variant='unstyled' />
            </Grid.Col>
            <Grid.Col span={'content'}>
              <Button leftIcon={undefined
                // <ThemeIcon size='sm' variant='filled' bg='transparent'>
                //   <IconLock />
                // </ThemeIcon>
              }>
                Login
              </Button>
            </Grid.Col>
          </Grid>
        </Paper>
      </Paper>
    </Center>
  </div>
}