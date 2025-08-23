export function isContractDeployed(): boolean {
  return Boolean(process.env.SPLITTER_CONTRACT_ID);
}

export function getContractId(): string | null {
  return process.env.SPLITTER_CONTRACT_ID || null;
}

export function getDeploymentInstructions(): string {
  return 'Contract not deployed. Run: ./scripts/deploy-contracts.sh';
}