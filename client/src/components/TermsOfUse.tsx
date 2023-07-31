import { Box, Button, Stack, Text } from "@mantine/core";
import { FC, useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const TermsOfUse: FC<{
  onSignature: (img: string) => void
  loading: boolean
}> = ({
  onSignature,
  loading
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<SignatureCanvas>(null);

  const [width, setWidth] = useState(0);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    setWidth(ref.current.clientWidth);
  }, []);

  const handleSign = () => {
    setSigned(true)
  }

  const handleAccept = () => {
    if (!canvasRef.current) return;

    const png = canvasRef.current.toDataURL()
    onSignature(png)
  };

  return (
    <Stack ref={ref}>
      <Text fw="bold">Apreciado/a participante:</Text>
      <Text>
        Agradeciendo su interés para participar en el proyecto de investigación
        ‘Un Estudio de la Interacción Humano-Robot en el Ámbito Educativo’,
        desarrollado por los estudiantes de Ingeniería de Sistemas para el curso
        de ‘Sistemas Computacionales’, es necesario que comprenda completamente
        el proyecto y su papel en él. Por ello le proporcionamos la siguiente
        información detallada:
      </Text>

      <Text fw="bold">Objetivo del proyecto:</Text>
      <Text>Mejorar la interacción humano-robot en el ámbito educativo.</Text>
      <Text fw="bold">Procedimientos:</Text>
      <Text>
        Para llevar a cabo este proyecto, se desarrollará una sesión de captura
        de datos (Preguntas) por participante. Estos datos se utilizarán
        únicamente con fines académicos, con ellos se pretende tener
        desarrollado un modelo entrenado al final del curso.
      </Text>
      <Text fw="bold">Riesgos e inconvenientes:</Text>
      <Text>
        Se espera que su participación en este proyecto no conlleve riesgos
        significativos. No obstante, en caso de querer retirarse del proyecto,
        puede hacerlo sin consecuencias.
      </Text>
      <Text fw="bold">Derechos, responsabilidades y beneficios:</Text>
      <Text>
        Con su participación en el estudio, tiene derecho a obtener información
        sobre el propósito de los datos suministrados, igualmente, puede
        solicitar retirar sus datos si se arrepiente de su participación. Por
        otro lado, con su participación, proporciona apoyo a la investigación en
        el área de interacción humano-robot.
      </Text>
      <Text fw="bold">Compensaciones o retribuciones:</Text>
      <Text>
        Por su participación en este proyecto no recibirá ninguna compensación
        ni retribución.
      </Text>
      <Text fw="bold">Confidencialidad y manejo de la información:</Text>
      <Text>
        La información que proporcione para el estudio será tratada con
        confidencialidad y solo se utilizará con fines académicos para alcanzar
        los objetivos del proyecto. Del mismo modo, todos sus datos personales
        serán protegidos y no se compartirán con terceros. Ahora bien, si acepta
        participar en el estudio, firme y coloque la fecha en la sección
        correspondiente a continuación. Además, si todavía tiene alguna pregunta
        sobre el proyecto o su participación, puede comunicarse a los correos
        electrónicos indicados al final del documento.
      </Text>

      <Box sx={{ border: "1px solid black" }}>
        <SignatureCanvas
          ref={canvasRef}
          canvasProps={{ width: width, height: 250 }}
          onEnd={handleSign}
        />
      </Box>

      <Text>Firme si esta de acuerdo con las condiciones</Text>

      <Button disabled={!signed} loading={loading}
       onClick={handleAccept}>Aceptar</Button>
    </Stack>
  );
};

export default TermsOfUse;
