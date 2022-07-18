## Running Hashicorp Vault

To run hashicorp vault locally first create volumes that you will mount for persisting vault state.

```
mkdir volumes/config
mkdir volumes/file
mkdir volumes/logs
```


After everything is created run `docker-compose up`. When docker container is running navigate to [http://localhost:8200/](http://localhost:8200/https:/) to start the setup process.

When setting up master keys, set keyshares and key treshold to `1`. After that you should be given your initial root token and Key 1. Save these.

After saving your keys, click continue and proceed to unseal the vault. You can unseal the vault using the Key 1 that was given to you in previous step.

Once vault is unsealed you have to login using the root token that was given to you.

## Enabling transit engine

In order for vault encryption to work we have to enable transit engine. Click Enable new engine on the root of the vault dashboard ui, select transit engine and enable it. Next create new encryption key inside the transit engine. Call this key `backend-encryption-key`.

## Adding new authentication method

In order for our backend to authenticate with vault we need to add new authentication method. Navigate to Access tab and click enable new method. Select username and password and continue. Dont change any method options, just keep defaults and enable.

Once userpass method is enabled, go back to the Access tab and click on the userpass method. Once there, create new user with some username and password. These will be used in environment variables as vault username and password.

## Setting up new policy

Navigate to policies tab and click create new policy. Make policy name `backend-encryption-policy` and use

```
path "transit/encrypt/backend-encryption-key" {
	capabilities = ["update"]
}

path "transit/decrypt/backend-encryption-key" {
	capabilities = ["update"]
}
```

as the policy value.

Once policy is created navigate to Access->userpass->your user and click edit user. Extend the `Tokens` tab and under `Generated Token's Policied` add `backend-encryption-policy`.
