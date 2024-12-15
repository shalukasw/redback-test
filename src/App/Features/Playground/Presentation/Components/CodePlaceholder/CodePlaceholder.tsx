import React, { FC } from 'react';
import { Col, Container, ProgressBar, Row } from 'react-bootstrap';
import styles from './code-placeholder.module.scss';
import { useTranslation } from 'react-i18next';

interface PlaceholderProps {
  width: number;
  variant: 'blue' | 'grey' | 'green';
}
const Placeholder: FC<PlaceholderProps> = ({ width, variant }) => {
  return (
    <>
      <style type="text/css">
        {`
            .progress {
              --bs-progress-height: 0.6rem;
              margin: 7px 0px;
            }
            .bg-blue {
              background-color: #3D1EFE;
            }
            .bg-grey {
              background-color: #D9D9D9;
            }
            .bg-green {
              background-color: #51AF07;
            }
        `}
      </style>
      <div style={{ width }}>
        <ProgressBar now={100} variant={variant} />
      </div>
    </>
  );
};

const CodePlaceholder = () => {
  const { t } = useTranslation();

  return (
    <Container className={`h-100 ${styles.container}`}>
      <Row className={styles.description_or_loader}>
        <div className={styles.default_title}>
          {t('playground.codePreviewPlaceholder')}
        </div>
      </Row>
      <Row className={styles.description_or_loader}>
        <Col className={styles.code_placeholder}>
          <Row xs="auto">
            <Col>
              <Placeholder variant="blue" width={121} />
            </Col>
            <Col>
              <Placeholder variant="grey" width={96} />
            </Col>
          </Row>
          <Placeholder variant="grey" width={154} />
          <Row xs="auto">
            <Col>
              <Placeholder variant="green" width={51} />
            </Col>
            <Col>
              <Placeholder variant="grey" width={146} />
            </Col>
          </Row>
          <Row xs="auto">
            <Col>
              <Placeholder variant="green" width={51} />
            </Col>
            <Col>
              <Placeholder variant="grey" width={84} />
            </Col>
          </Row>

          <Row xs="auto">
            <Col>
              <Placeholder variant="grey" width={81} />
            </Col>
            <Col>
              <Placeholder variant="grey" width={81} />
            </Col>
          </Row>
          <Row xs="auto">
            <Col>
              <Placeholder variant="blue" width={67} />
            </Col>
            <Col>
              <Placeholder variant="grey" width={53} />
            </Col>
          </Row>
          <Placeholder variant="grey" width={154} />
          <Placeholder variant="grey" width={91} />
        </Col>
      </Row>
    </Container>
  );
};

export default CodePlaceholder;
