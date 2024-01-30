

## [2024.1.20](https://github.com/betagouv/hyyypertool/compare/2024.1.19...2024.1.20) (2024-01-30)


### Features

* **moderations:** add hide join organization filter the table ([#27](https://github.com/betagouv/hyyypertool/issues/27)) ([58051ed](https://github.com/betagouv/hyyypertool/commit/58051ed930cc6d97f66321e916987a08defec7dc))

## [2024.1.19](https://github.com/betagouv/hyyypertool/compare/2024.1.18...2024.1.19) (2024-01-29)


### Bug Fixes

* **moderation:** ensure zammad send an email ([#26](https://github.com/betagouv/hyyypertool/issues/26)) ([a1a05bb](https://github.com/betagouv/hyyypertool/commit/a1a05bb9a23a553f0fcffc3f081ad475ced1a483))
* **moderations:** refresh the table when visible ([#19](https://github.com/betagouv/hyyypertool/issues/19)) ([e5a3b04](https://github.com/betagouv/hyyypertool/commit/e5a3b048e036b84fa17ccaef8533003bd4f8a0e8))
* **moderations:** the table pagination starts at 1 ([#23](https://github.com/betagouv/hyyypertool/issues/23)) ([0ae26c8](https://github.com/betagouv/hyyypertool/commit/0ae26c80432adf6cacf7de0291a522c385f0a296))
* **users:** organization member pathname bug in user routes ([8b20f41](https://github.com/betagouv/hyyypertool/commit/8b20f41fdb33acd778ec512f58c52970c0ee8ba5))


### Features

* add background activity indicator ([#22](https://github.com/betagouv/hyyypertool/issues/22)) ([8989e3f](https://github.com/betagouv/hyyypertool/commit/8989e3f9cf1434c23c47f91853f151329af6499e))
* **moderations:** make the whole moderation line clickable ([#24](https://github.com/betagouv/hyyypertool/issues/24)) ([8482d1e](https://github.com/betagouv/hyyypertool/commit/8482d1e20371f910bdd11c6efbc2e61d5af24b61))


### Reverts

* **legacy:** add confirm prompt on mark as processed buttons ([#25](https://github.com/betagouv/hyyypertool/issues/25)) ([6c6cf3d](https://github.com/betagouv/hyyypertool/commit/6c6cf3db6fc23ffec91025b615a40428182fd219))

## [2024.1.18](https://github.com/betagouv/hyyypertool/compare/2024.1.17...2024.1.18) (2024-01-26)


### Bug Fixes

* **moderation:** pathname bug in organization routes ([b319edf](https://github.com/betagouv/hyyypertool/commit/b319edfc287ba06b934b46f6b55c2180f4630672))

## [2024.1.17](https://github.com/betagouv/hyyypertool/compare/2024.1.16...2024.1.17) (2024-01-26)


### Bug Fixes

* **moderation:** extract members email in reponse ([b7e4430](https://github.com/betagouv/hyyypertool/commit/b7e443040104428cbd8f79fa1b292cec9b72ed42))
* **moderation:** list authorized_email_domains in reponse template ([8d264d0](https://github.com/betagouv/hyyypertool/commit/8d264d081139f8d25f9b48ab1e0c52225588cfb8))


### Features

* **ui:** activate globalViewTransitions ([3df9eaf](https://github.com/betagouv/hyyypertool/commit/3df9eaf995870680c33f450bb0d67336cc92fc08))

## [2024.1.16](https://github.com/betagouv/hyyypertool/compare/2024.1.15...2024.1.16) (2024-01-25)


### Bug Fixes

* **moderation:** next page ignore part of the filter ([ef326bd](https://github.com/betagouv/hyyypertool/commit/ef326bd000b767cc6f468c65f4c98a9fec16c10b))
* **moderation:** next page ignore part of the filter (2) ([50d5e31](https://github.com/betagouv/hyyypertool/commit/50d5e317532e834d0f22ee738cc76964e8641621))

## [2024.1.15](https://github.com/betagouv/hyyypertool/compare/2024.1.14...2024.1.15) (2024-01-25)


### Bug Fixes

* **moderation:** typo on moderation type label ([220d7e6](https://github.com/betagouv/hyyypertool/commit/220d7e6b930b625a977c72bd8073d6f97652ff3d))

## [2024.1.14](https://github.com/betagouv/hyyypertool/compare/2024.1.13...2024.1.14) (2024-01-25)


### Features

* **moderations:** add hide non_verified_domain ([101046d](https://github.com/betagouv/hyyypertool/commit/101046df6d021f413749266084d2107a553e75e5))

## [2024.1.13](https://github.com/betagouv/hyyypertool/compare/2024.1.12...2024.1.13) (2024-01-25)


### Bug Fixes

* **moderation:** change magic color number ([302645d](https://github.com/betagouv/hyyypertool/commit/302645d697f32b34c1b3777ef40524d4ea87007b))


### Features

* **welcome:** auto redirect to /moderation if already logged ([58973a6](https://github.com/betagouv/hyyypertool/commit/58973a678415d242a211eb602bfbcb7b447b1dcd))

## [2024.1.12](https://github.com/betagouv/hyyypertool/compare/2024.1.11...2024.1.12) (2024-01-25)


### Bug Fixes

* **common:** rename UserError to HTTPError ([2928c7e](https://github.com/betagouv/hyyypertool/commit/2928c7edf1fdde505d309788c0af28e291784bab))
* **services:** ensure to log the method on error ([ef837f3](https://github.com/betagouv/hyyypertool/commit/ef837f39ca627cede226729d0ff88bd36028403f))


* feat(moderations)!: move /legacy to /moderations (#9) ([f3aa797](https://github.com/betagouv/hyyypertool/commit/f3aa797ba0caa0abedc29b42cbf3bbe30022ab51)), closes [#9](https://github.com/betagouv/hyyypertool/issues/9)
* feat(legacy)!: change moderation navigation (#8) ([86af83e](https://github.com/betagouv/hyyypertool/commit/86af83e4183ad124c6ef23b9ccb858f1e87a57d2)), closes [#8](https://github.com/betagouv/hyyypertool/issues/8)


### Features

* **legacy:** add confirm prompt on mark as processed buttons ([f75e864](https://github.com/betagouv/hyyypertool/commit/f75e8648190ef6bc553267bf87beb6ea19ae15d4))
* **legacy:** centrelize moderation id name ([1b6f889](https://github.com/betagouv/hyyypertool/commit/1b6f8895d9a5b5c51c11b6186f3131ffa17a4476))


### BREAKING CHANGES

* the `/legacy` is no more `/moderations` 
* the `/legacy?id=xxxx` is no more `/legacy/moderations/xxxx`

## [2024.1.11](https://github.com/betagouv/hyyypertool/compare/2024.1.10...2024.1.11) (2024-01-24)


### Features

* **legacy:** display latest users and organizations first ([3c2d76b](https://github.com/betagouv/hyyypertool/commit/3c2d76b5a84292256b3228454c17fb18966cb28f))
* **legacy:** separate row and links ([d8010a4](https://github.com/betagouv/hyyypertool/commit/d8010a4243c5e9f648b2fb31d0574765dbc2a4a0))

## [2024.1.10](https://github.com/betagouv/hyyypertool/compare/2024.1.9...2024.1.10) (2024-01-24)


### Features

* **legacy:** show more moderations ([c8e3532](https://github.com/betagouv/hyyypertool/commit/c8e3532fe6459a1599014e89efe5fefdf734ea72))

## [2024.1.9](https://github.com/betagouv/hyyypertool/compare/2024.1.8...2024.1.9) (2024-01-24)


### Features

* **legacy:** mark rejected moderations ([226343b](https://github.com/betagouv/hyyypertool/commit/226343bba888d7f2c04794b8a8eb13e04c8677a5))

## [2024.1.8](https://github.com/betagouv/hyyypertool/compare/2024.1.7...2024.1.8) (2024-01-24)


### Features

* **legacy:** add comment field in the shadow ([53b84d3](https://github.com/betagouv/hyyypertool/commit/53b84d37209e72a0d96f411e27186a518e5f3ce3))
* **legacy:** durty dsfr hack for the 01 section ([bffb204](https://github.com/betagouv/hyyypertool/commit/bffb204281dd13fea53355fafe3257e312d52e80))
* **legacy:** hold the session userinfo in a context through the stream ([b7218f3](https://github.com/betagouv/hyyypertool/commit/b7218f36a4ee7d26c6277333a6413440ea20370c))
* **legacy:** smooth markers ([4b55378](https://github.com/betagouv/hyyypertool/commit/4b55378bb00e92aed86862fa8b6688145d1447db))
* **legacy:** wait 2s for the input to change ([3a3dd18](https://github.com/betagouv/hyyypertool/commit/3a3dd18a55124e3aa2d385fda0c5c839d1e9b554))
* **ui:** add input group hint ([c8e238e](https://github.com/betagouv/hyyypertool/commit/c8e238e271160d32345387b3f1c8053ca10eea1d))

## [2024.1.7](https://github.com/betagouv/hyyypertool/compare/2024.1.6...2024.1.7) (2024-01-23)


### Features

* **legacy:** duplicate warning list the moderation with state ([ce89ebb](https://github.com/betagouv/hyyypertool/commit/ce89ebbbe5da34ff95302c5985b63ab482520c5b))
* **legacy:** isolate duplicate warning ([c461944](https://github.com/betagouv/hyyypertool/commit/c461944e86083248eb4717e56fa2b5a272f8e4c3))

## [2024.1.6](https://github.com/betagouv/hyyypertool/compare/2024.1.5...2024.1.6) (2024-01-22)


### Bug Fixes

* **legacy:** display moderation created_at not user's ([40ad9ca](https://github.com/betagouv/hyyypertool/commit/40ad9ca09dc8f87b4dc92da078a47a7367897dbb))

## [2024.1.5](https://github.com/betagouv/hyyypertool/compare/2024.1.4...2024.1.5) (2024-01-22)


### Features

* **health:** add zammad me check ([c92bcb1](https://github.com/betagouv/hyyypertool/commit/c92bcb156a1df80c1d1bad3b0cd0c856d8296e42))

## [2024.1.4](https://github.com/betagouv/hyyypertool/compare/2024.1.3...2024.1.4) (2024-01-22)

# [2024.2.0](https://github.com/betagouv/hyyypertool/compare/2024.1.2...2024.2.0) (2024-01-22)


### Features

* **sentry:** better sentry tags ([7220125](https://github.com/betagouv/hyyypertool/commit/72201253871ac1aa7cca3d88c4f9c0693d8014eb))

# [2024.2.0](https://github.com/betagouv/hyyypertool/compare/2024.01.18.0...2024.2.0) (2024-01-22)


### Features

* **legacy:** major zammad power ([8a58122](https://github.com/betagouv/hyyypertool/commit/8a581228693ba42c7cf17fb53e0c8c1cca910c53))
* restrict users ([49d7b2c](https://github.com/betagouv/hyyypertool/commit/49d7b2c62af5d8399018619bc0fdd3e6d9e22e20))

## [2024.1.22-0.0](https://github.com/betagouv/hyyypertool/compare/2024.01.18.0...null) (2024-01-22)


### Features

* **legacy:** major zammad power ([8a58122](https://github.com/betagouv/hyyypertool/commit/8a581228693ba42c7cf17fb53e0c8c1cca910c53))
* restrict users ([49d7b2c](https://github.com/betagouv/hyyypertool/commit/49d7b2c62af5d8399018619bc0fdd3e6d9e22e20))

# [2024.01.18.0](https://github.com/betagouv/hyyypertool/compare/2024.01.11.0...2024.01.18.0) (2024-01-22)


### Bug Fixes

* **legacy:** inversed is_external action ([e81e3bd](https://github.com/betagouv/hyyypertool/commit/e81e3bda6b9094cb9b30aa14870266801df88c69))
* **legacy:** remove host prefixes from action buttons ([7d10cdd](https://github.com/betagouv/hyyypertool/commit/7d10cddb4e0007e444fc5209696fa3101f56b06d))
* make email and name required by default ([b604606](https://github.com/betagouv/hyyypertool/commit/b604606eb3d5ecd009ac4c2ffa2d181c54b35e9c))
* **organizations:** add verified route ([0da5c0a](https://github.com/betagouv/hyyypertool/commit/0da5c0a509df8e0fa2e7ce0772a5e6bbed99df54))
* use AGENTCONNECT_OIDC_SCOPE as scope ([b411e25](https://github.com/betagouv/hyyypertool/commit/b411e259f589c5abc4881514148edcf80d9ee59d))
* use direct env version number ([a0ca6b4](https://github.com/betagouv/hyyypertool/commit/a0ca6b404c35ec4559144d3da02e586aaff93eda))


### Features

* add reel 404 page ([5211d7d](https://github.com/betagouv/hyyypertool/commit/5211d7d6ebabf0833cb048ac8c4e64ad1867fbe3))
* dummy orange buttons ([83743a8](https://github.com/betagouv/hyyypertool/commit/83743a8fd2c50141a807671045cc81c2d67ca0b2))
* force major version update ([b23c390](https://github.com/betagouv/hyyypertool/commit/b23c390868739657dc33fe9d054c89fcf685829f))
* introduce sentry error catcher ([3525d0c](https://github.com/betagouv/hyyypertool/commit/3525d0caa5d20584032c90692b1dc08c8b2cee46))
* **legacy:** major zammad power ([8a58122](https://github.com/betagouv/hyyypertool/commit/8a581228693ba42c7cf17fb53e0c8c1cca910c53))
* **legacy:** remove 4th section ([79bda07](https://github.com/betagouv/hyyypertool/commit/79bda071340bacc050dabffae3c26ad369d8f69e))
* **legacy:** sort by last created at by default ([4a85a9c](https://github.com/betagouv/hyyypertool/commit/4a85a9c876bbcfa70b760838e85a972e386ba21e))
* **moderations:** display is_external if defined ([371b4ea](https://github.com/betagouv/hyyypertool/commit/371b4ead59f4fe52d8634634562358ae2c4c5b48))
* **moderations:** share type to emoji ([bc15afa](https://github.com/betagouv/hyyypertool/commit/bc15afa59f54256d04d391707fca2403375fb52a))
* **moderations:** support legacy types ([d22e8e9](https://github.com/betagouv/hyyypertool/commit/d22e8e97721f2f60523198ccf25d9c0fd312136a))
* **organizations:** add join_organization ([8f10142](https://github.com/betagouv/hyyypertool/commit/8f10142560e6e38cce5ad59c729c315c39ebfc40))
* **organizations:** add link to organization ([9c9f8fc](https://github.com/betagouv/hyyypertool/commit/9c9f8fc78ab92a2a02298230d15d037f9300f83e))
* **organizations:** add remove verified button ([8f2ed28](https://github.com/betagouv/hyyypertool/commit/8f2ed284f95da28a8e2b3a57c8e0853a1b832185))
* **organizations:** add see annuaire fiche link ([1e7b126](https://github.com/betagouv/hyyypertool/commit/1e7b126c8dde0dd1b531d2b6dc7c1173ac896a7b))
* **organizations:** add verified route ([6c7b437](https://github.com/betagouv/hyyypertool/commit/6c7b437a2ddf5fb794e7a377a77d26b427790a6e))
* **organizations:** call mark-domain-as-verified ([71d7b75](https://github.com/betagouv/hyyypertool/commit/71d7b758281e52a8e643b6ac0338d842243de0c2))
* **organizations:** share events ([736ca45](https://github.com/betagouv/hyyypertool/commit/736ca451fe46fefc319feec5cbd70c5ae4c0380f))
* **organizations:** share events using z.enum ([341f325](https://github.com/betagouv/hyyypertool/commit/341f325867c5ea0c24c3bb32f10a48e153774244))
* **organizations:** use members updated event ([a9224eb](https://github.com/betagouv/hyyypertool/commit/a9224eb465123a53177daec2450b8ad68105e2cc))
* **proxy:** ensure to proxy before the legacy guard route ([aaed65e](https://github.com/betagouv/hyyypertool/commit/aaed65ee1382a088b76241f4d1b92e0c1e6d4593))
* **proxy:** ensure to set the guard on legacy routes only ([7d0612a](https://github.com/betagouv/hyyypertool/commit/7d0612aaa12578f99f65016c557244c3339193f4))
* restrict users ([49d7b2c](https://github.com/betagouv/hyyypertool/commit/49d7b2c62af5d8399018619bc0fdd3e6d9e22e20))
* **sentry:** add dummy sentry endpoint test ([d4dad64](https://github.com/betagouv/hyyypertool/commit/d4dad64b027ff85c66c9e65a5da184cc830372b5))
* share the nonce ([86b9be6](https://github.com/betagouv/hyyypertool/commit/86b9be67306911e1810884470b9db61b55846de5))
* share the nonce (2) ([c9d9d39](https://github.com/betagouv/hyyypertool/commit/c9d9d39bd3280123fd21d3845ec7f79a7203fabb))
* share the nonce (3) ([cd7149b](https://github.com/betagouv/hyyypertool/commit/cd7149b82c2e2e884246dc3f896e516cedcccf60))
* share the nonce (4) ([b9a3a52](https://github.com/betagouv/hyyypertool/commit/b9a3a5208dcafc57b2fe8dedade424de285b0b60))
* **users:** link to moderations ([ab9bebf](https://github.com/betagouv/hyyypertool/commit/ab9bebf5a8a85563097d07a1018df48c38ee1951))
* **users:** remove and reset button ([5c98475](https://github.com/betagouv/hyyypertool/commit/5c984750806b738c530f7540628dd28ebf3952d0))


### Reverts

* Revert "ci(github): zdd incremental flag to release-it command" ([916449b](https://github.com/betagouv/hyyypertool/commit/916449bbcff24dd4465ca7df9b6066e003efde51))

## [2024.1.18](https://github.com/betagouv/hyyypertool/compare/2024.01.11.0...null) (2024-01-18)


### Bug Fixes

* **legacy:** inversed is_external action ([e81e3bd](https://github.com/betagouv/hyyypertool/commit/e81e3bda6b9094cb9b30aa14870266801df88c69))
* **legacy:** remove host prefixes from action buttons ([7d10cdd](https://github.com/betagouv/hyyypertool/commit/7d10cddb4e0007e444fc5209696fa3101f56b06d))
* make email and name required by default ([b604606](https://github.com/betagouv/hyyypertool/commit/b604606eb3d5ecd009ac4c2ffa2d181c54b35e9c))
* **organizations:** add verified route ([0da5c0a](https://github.com/betagouv/hyyypertool/commit/0da5c0a509df8e0fa2e7ce0772a5e6bbed99df54))
* use AGENTCONNECT_OIDC_SCOPE as scope ([b411e25](https://github.com/betagouv/hyyypertool/commit/b411e259f589c5abc4881514148edcf80d9ee59d))
* use direct env version number ([a0ca6b4](https://github.com/betagouv/hyyypertool/commit/a0ca6b404c35ec4559144d3da02e586aaff93eda))


### Features

* add reel 404 page ([5211d7d](https://github.com/betagouv/hyyypertool/commit/5211d7d6ebabf0833cb048ac8c4e64ad1867fbe3))
* dummy orange buttons ([83743a8](https://github.com/betagouv/hyyypertool/commit/83743a8fd2c50141a807671045cc81c2d67ca0b2))
* force major version update ([b23c390](https://github.com/betagouv/hyyypertool/commit/b23c390868739657dc33fe9d054c89fcf685829f))
* introduce sentry error catcher ([3525d0c](https://github.com/betagouv/hyyypertool/commit/3525d0caa5d20584032c90692b1dc08c8b2cee46))
* **legacy:** remove 4th section ([79bda07](https://github.com/betagouv/hyyypertool/commit/79bda071340bacc050dabffae3c26ad369d8f69e))
* **legacy:** sort by last created at by default ([4a85a9c](https://github.com/betagouv/hyyypertool/commit/4a85a9c876bbcfa70b760838e85a972e386ba21e))
* **moderations:** display is_external if defined ([371b4ea](https://github.com/betagouv/hyyypertool/commit/371b4ead59f4fe52d8634634562358ae2c4c5b48))
* **moderations:** share type to emoji ([bc15afa](https://github.com/betagouv/hyyypertool/commit/bc15afa59f54256d04d391707fca2403375fb52a))
* **moderations:** support legacy types ([d22e8e9](https://github.com/betagouv/hyyypertool/commit/d22e8e97721f2f60523198ccf25d9c0fd312136a))
* **organizations:** add join_organization ([8f10142](https://github.com/betagouv/hyyypertool/commit/8f10142560e6e38cce5ad59c729c315c39ebfc40))
* **organizations:** add link to organization ([9c9f8fc](https://github.com/betagouv/hyyypertool/commit/9c9f8fc78ab92a2a02298230d15d037f9300f83e))
* **organizations:** add remove verified button ([8f2ed28](https://github.com/betagouv/hyyypertool/commit/8f2ed284f95da28a8e2b3a57c8e0853a1b832185))
* **organizations:** add see annuaire fiche link ([1e7b126](https://github.com/betagouv/hyyypertool/commit/1e7b126c8dde0dd1b531d2b6dc7c1173ac896a7b))
* **organizations:** add verified route ([6c7b437](https://github.com/betagouv/hyyypertool/commit/6c7b437a2ddf5fb794e7a377a77d26b427790a6e))
* **organizations:** call mark-domain-as-verified ([71d7b75](https://github.com/betagouv/hyyypertool/commit/71d7b758281e52a8e643b6ac0338d842243de0c2))
* **organizations:** share events ([736ca45](https://github.com/betagouv/hyyypertool/commit/736ca451fe46fefc319feec5cbd70c5ae4c0380f))
* **organizations:** share events using z.enum ([341f325](https://github.com/betagouv/hyyypertool/commit/341f325867c5ea0c24c3bb32f10a48e153774244))
* **organizations:** use members updated event ([a9224eb](https://github.com/betagouv/hyyypertool/commit/a9224eb465123a53177daec2450b8ad68105e2cc))
* **proxy:** ensure to proxy before the legacy guard route ([aaed65e](https://github.com/betagouv/hyyypertool/commit/aaed65ee1382a088b76241f4d1b92e0c1e6d4593))
* **proxy:** ensure to set the guard on legacy routes only ([7d0612a](https://github.com/betagouv/hyyypertool/commit/7d0612aaa12578f99f65016c557244c3339193f4))
* **sentry:** add dummy sentry endpoint test ([d4dad64](https://github.com/betagouv/hyyypertool/commit/d4dad64b027ff85c66c9e65a5da184cc830372b5))
* share the nonce ([86b9be6](https://github.com/betagouv/hyyypertool/commit/86b9be67306911e1810884470b9db61b55846de5))
* share the nonce (2) ([c9d9d39](https://github.com/betagouv/hyyypertool/commit/c9d9d39bd3280123fd21d3845ec7f79a7203fabb))
* share the nonce (3) ([cd7149b](https://github.com/betagouv/hyyypertool/commit/cd7149b82c2e2e884246dc3f896e516cedcccf60))
* share the nonce (4) ([b9a3a52](https://github.com/betagouv/hyyypertool/commit/b9a3a5208dcafc57b2fe8dedade424de285b0b60))
* **users:** link to moderations ([ab9bebf](https://github.com/betagouv/hyyypertool/commit/ab9bebf5a8a85563097d07a1018df48c38ee1951))
* **users:** remove and reset button ([5c98475](https://github.com/betagouv/hyyypertool/commit/5c984750806b738c530f7540628dd28ebf3952d0))


### Reverts

* Revert "ci(github): zdd incremental flag to release-it command" ([916449b](https://github.com/betagouv/hyyypertool/commit/916449bbcff24dd4465ca7df9b6066e003efde51))

## [2023.11.12](https://github.com/betagouv/hyyypertool/compare/2023.11.11...2023.11.12) (2024-01-11)


### Reverts

* Revert "ci(github): force no increment version every release" ([90c40ca](https://github.com/betagouv/hyyypertool/commit/90c40ca32bcb627afc2725a5883c34b88784b64f))

## [2023.11.11](https://github.com/betagouv/hyyypertool/compare/8fc248ad305391b85d7d96f25ce07d1336180481...2023.11.11) (2024-01-11)


### Bug Fixes

* broken jsx ([c575889](https://github.com/betagouv/hyyypertool/commit/c5758892c7fe7fa2e2e1253d789ecdaa03e6d807))
* display empty moderation section ([3f2192f](https://github.com/betagouv/hyyypertool/commit/3f2192f334dd4b019dba67529503b8424ba91d0d))
* **env:** no default host ([19f3b69](https://github.com/betagouv/hyyypertool/commit/19f3b69c61f17996af0eaec88ab8b96bae254be2))
* fixed auth calls ([c14dc62](https://github.com/betagouv/hyyypertool/commit/c14dc62f92b3a585b410e757442b1e595993f5b8))
* **layout:** logout ([04d68f0](https://github.com/betagouv/hyyypertool/commit/04d68f08717a24a56048e63d1f19def9c09fb559))
* **legacy:** remove duplicate info ([287a54c](https://github.com/betagouv/hyyypertool/commit/287a54c55e23cb23ead9c3fc28634839e3cf80d9))
* **proxy:** use req.url ([ff4ff11](https://github.com/betagouv/hyyypertool/commit/ff4ff1141563459b74bd29a0ee72a72185a88fff))
* **proxy:** use req.url (2) ([bf653f8](https://github.com/betagouv/hyyypertool/commit/bf653f8c652db5e395dfa3cc1a40745ed6750228))
* **proxy:** use req.url (3) ([c0ce829](https://github.com/betagouv/hyyypertool/commit/c0ce829c6ad99e02f4cc7d1407aa410f4e773173))
* **scalingo:** write the GIT_SHA ([c5260f0](https://github.com/betagouv/hyyypertool/commit/c5260f048a8a8d6be8dba2523cbea9d1892d69da))
* **users:** organizations authorized_email_domains display ([0e0a228](https://github.com/betagouv/hyyypertool/commit/0e0a228314c5c1058454f555ccebc3f0d7f0f194))


### Features

* dummy pages ([8fc248a](https://github.com/betagouv/hyyypertool/commit/8fc248ad305391b85d7d96f25ce07d1336180481))
* extra fields ([af4856c](https://github.com/betagouv/hyyypertool/commit/af4856c28630ca92d51c4530883aa6698e1f7079))
* **legacy:** add users explorer page ([ddc097c](https://github.com/betagouv/hyyypertool/commit/ddc097c2129ea20fa8b9ecceb1df340643592dd0))
* **legacy:** better decision part ([24fd645](https://github.com/betagouv/hyyypertool/commit/24fd645b18e24e049939caa08e0d9d47e257d7d8))
* **legacy:** better navigation between pages ([9c5baf0](https://github.com/betagouv/hyyypertool/commit/9c5baf0550e198094724beb95607cfbb22e9b515))
* **legacy:** bulk section page update ([6da4433](https://github.com/betagouv/hyyypertool/commit/6da4433e8f495320ec1edf379953686a086a3d0e))
* **legacy:** bulk section page update (2) ([3b0eabf](https://github.com/betagouv/hyyypertool/commit/3b0eabf8a01ef8d918cd7bd731f77ebd4f282495))
* **legacy:** bulk section page update (3) ([ecc2ec7](https://github.com/betagouv/hyyypertool/commit/ecc2ec72fcf43bcc527c649f32cf1075ec54d263))
* **legacy:** show archived moderations ([15acbe8](https://github.com/betagouv/hyyypertool/commit/15acbe8b3634a7a7900b100f6d1c4e319b5fd15a))
* make it better ([8aa35e2](https://github.com/betagouv/hyyypertool/commit/8aa35e286509679209a8c2635be6b6b53161f97f))
* **organizations:** add organizations pages ([7382340](https://github.com/betagouv/hyyypertool/commit/7382340fc0adadde16c19dc1e3228b1d1a2c5329))
* use lit as client component provider ([f67301c](https://github.com/betagouv/hyyypertool/commit/f67301cf7de664b0b7f90dc09f3c7950d62642df))
* **www:** add cache control ([3c80886](https://github.com/betagouv/hyyypertool/commit/3c80886ffea250f234ca4b360bad2f40a1cb5011))
* **www:** add localhost proxy ([5ccee4c](https://github.com/betagouv/hyyypertool/commit/5ccee4c11d2193472597c82a1dcde25d3693ad55))
* **www:** dummy flagged agentconnect login ([9a930fb](https://github.com/betagouv/hyyypertool/commit/9a930fb80403b5ecbc11dd4c6d0a8a9de906aea4))
* **www:** make agentconnect work :) ([a9c897b](https://github.com/betagouv/hyyypertool/commit/a9c897b4c2fe501e9425c083fc7f1ba9be8b080f))


### Performance Improvements

* **legacy:** delay database calls ([15ea123](https://github.com/betagouv/hyyypertool/commit/15ea123053b9b91563b80d1df87516ad5d31e549))


### Reverts

* Revert "debug(www): redirect uri" ([2c2ce3c](https://github.com/betagouv/hyyypertool/commit/2c2ce3c62dba845f976dffc62f575f5a80088e15))
* Revert "debug(scalingo): SIGSEGV (5)" ([6d18cf7](https://github.com/betagouv/hyyypertool/commit/6d18cf724dbe6bbc65b2e9be031b71aab143d398))
* Revert "debug(scalingo): test multi-buildpack" ([1451111](https://github.com/betagouv/hyyypertool/commit/14511116a505b12a4619f1e61215642ce5b778d8))
* Revert "debug(scalingo): test multi-buildpack (2)" ([17d7d0d](https://github.com/betagouv/hyyypertool/commit/17d7d0d16a25273ad8c43ae805dceced8b7050b2))

## 2023.11.11 (2024-01-11)


### Bug Fixes

* broken jsx ([c575889](https://github.com/betagouv/hyyypertool/commit/c5758892c7fe7fa2e2e1253d789ecdaa03e6d807))
* display empty moderation section ([3f2192f](https://github.com/betagouv/hyyypertool/commit/3f2192f334dd4b019dba67529503b8424ba91d0d))
* **env:** no default host ([19f3b69](https://github.com/betagouv/hyyypertool/commit/19f3b69c61f17996af0eaec88ab8b96bae254be2))
* fixed auth calls ([c14dc62](https://github.com/betagouv/hyyypertool/commit/c14dc62f92b3a585b410e757442b1e595993f5b8))
* **layout:** logout ([04d68f0](https://github.com/betagouv/hyyypertool/commit/04d68f08717a24a56048e63d1f19def9c09fb559))
* **legacy:** remove duplicate info ([287a54c](https://github.com/betagouv/hyyypertool/commit/287a54c55e23cb23ead9c3fc28634839e3cf80d9))
* **proxy:** use req.url ([ff4ff11](https://github.com/betagouv/hyyypertool/commit/ff4ff1141563459b74bd29a0ee72a72185a88fff))
* **proxy:** use req.url (2) ([bf653f8](https://github.com/betagouv/hyyypertool/commit/bf653f8c652db5e395dfa3cc1a40745ed6750228))
* **proxy:** use req.url (3) ([c0ce829](https://github.com/betagouv/hyyypertool/commit/c0ce829c6ad99e02f4cc7d1407aa410f4e773173))
* **scalingo:** write the GIT_SHA ([c5260f0](https://github.com/betagouv/hyyypertool/commit/c5260f048a8a8d6be8dba2523cbea9d1892d69da))
* **users:** organizations authorized_email_domains display ([0e0a228](https://github.com/betagouv/hyyypertool/commit/0e0a228314c5c1058454f555ccebc3f0d7f0f194))


### Features

* dummy pages ([8fc248a](https://github.com/betagouv/hyyypertool/commit/8fc248ad305391b85d7d96f25ce07d1336180481))
* extra fields ([af4856c](https://github.com/betagouv/hyyypertool/commit/af4856c28630ca92d51c4530883aa6698e1f7079))
* **legacy:** add users explorer page ([ddc097c](https://github.com/betagouv/hyyypertool/commit/ddc097c2129ea20fa8b9ecceb1df340643592dd0))
* **legacy:** better decision part ([24fd645](https://github.com/betagouv/hyyypertool/commit/24fd645b18e24e049939caa08e0d9d47e257d7d8))
* **legacy:** better navigation between pages ([9c5baf0](https://github.com/betagouv/hyyypertool/commit/9c5baf0550e198094724beb95607cfbb22e9b515))
* **legacy:** bulk section page update ([6da4433](https://github.com/betagouv/hyyypertool/commit/6da4433e8f495320ec1edf379953686a086a3d0e))
* **legacy:** bulk section page update (2) ([3b0eabf](https://github.com/betagouv/hyyypertool/commit/3b0eabf8a01ef8d918cd7bd731f77ebd4f282495))
* **legacy:** bulk section page update (3) ([ecc2ec7](https://github.com/betagouv/hyyypertool/commit/ecc2ec72fcf43bcc527c649f32cf1075ec54d263))
* **legacy:** show archived moderations ([15acbe8](https://github.com/betagouv/hyyypertool/commit/15acbe8b3634a7a7900b100f6d1c4e319b5fd15a))
* make it better ([8aa35e2](https://github.com/betagouv/hyyypertool/commit/8aa35e286509679209a8c2635be6b6b53161f97f))
* **organizations:** add organizations pages ([7382340](https://github.com/betagouv/hyyypertool/commit/7382340fc0adadde16c19dc1e3228b1d1a2c5329))
* use lit as client component provider ([f67301c](https://github.com/betagouv/hyyypertool/commit/f67301cf7de664b0b7f90dc09f3c7950d62642df))
* **www:** add cache control ([3c80886](https://github.com/betagouv/hyyypertool/commit/3c80886ffea250f234ca4b360bad2f40a1cb5011))
* **www:** add localhost proxy ([5ccee4c](https://github.com/betagouv/hyyypertool/commit/5ccee4c11d2193472597c82a1dcde25d3693ad55))
* **www:** dummy flagged agentconnect login ([9a930fb](https://github.com/betagouv/hyyypertool/commit/9a930fb80403b5ecbc11dd4c6d0a8a9de906aea4))
* **www:** make agentconnect work :) ([a9c897b](https://github.com/betagouv/hyyypertool/commit/a9c897b4c2fe501e9425c083fc7f1ba9be8b080f))


### Performance Improvements

* **legacy:** delay database calls ([15ea123](https://github.com/betagouv/hyyypertool/commit/15ea123053b9b91563b80d1df87516ad5d31e549))


### Reverts

* Revert "debug(www): redirect uri" ([2c2ce3c](https://github.com/betagouv/hyyypertool/commit/2c2ce3c62dba845f976dffc62f575f5a80088e15))
* Revert "debug(scalingo): SIGSEGV (5)" ([6d18cf7](https://github.com/betagouv/hyyypertool/commit/6d18cf724dbe6bbc65b2e9be031b71aab143d398))
* Revert "debug(scalingo): test multi-buildpack" ([1451111](https://github.com/betagouv/hyyypertool/commit/14511116a505b12a4619f1e61215642ce5b778d8))
* Revert "debug(scalingo): test multi-buildpack (2)" ([17d7d0d](https://github.com/betagouv/hyyypertool/commit/17d7d0d16a25273ad8c43ae805dceced8b7050b2))
