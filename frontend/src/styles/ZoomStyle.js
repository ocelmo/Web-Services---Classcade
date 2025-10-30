import styled from 'styled-components';

export const ZoomContainer = styled.div`
  display: flex;
  height: 100vh;
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  position: relative;
  background-color: #f9f9fb;
  overflow-y: auto;
`;

export const ProfileRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
`;

export const ZoomHeader = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ZoomMessage = styled.p`
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #444;

  strong {
    color: #222;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
`;

export const ZoomButton = styled.button`
  background-color: ${({ color }) =>
    color === 'blue' ? '#3b82f6' : color === 'green' ? '#10b981' : '#ccc'};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ color }) =>
      color === 'blue' ? '#2563eb' : color === 'green' ? '#059669' : '#aaa'};
  }
`;
