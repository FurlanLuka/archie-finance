export interface VaultEncryptionData {
  data: {
    batch_results: {
      ciphertext: string;
    }[];
  };
}

export interface VaultDecryptionData {
  data: {
    batch_results: {
      plaintext: string;
    }[];
  };
}
