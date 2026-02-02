import {
    FireCMS,
    Scaffold,
    AppBar,
    Drawer,
    NavigationRoutes,
    SideDialogs,
    SnackbarProvider,
    ModeControllerProvider,
    useBuildModeController,
    useBuildNavigationController
} from "@firecms/core"
import {
    useInitialiseFirebase,
    useFirestoreDelegate,
    useFirebaseStorageSource,
    useFirebaseAuthController,
    FirebaseLoginView
} from "@firecms/firebase"
import {storeCollection} from "../firecms.config"

export default function Dashboard() {
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    }

    const {firebaseApp, firebaseConfigLoading} = useInitialiseFirebase({firebaseConfig})
    const modeController = useBuildModeController()
    const firestoreDelegate = useFirestoreDelegate({firebaseApp})
    const storageSource = useFirebaseStorageSource({firebaseApp})

    const authController = useFirebaseAuthController({
        firebaseApp,
        signInOptions: ["password"]
    })

    const navigationController = useBuildNavigationController({
        collections: [storeCollection],
        authController,
        dataSourceDelegate: firestoreDelegate,
        basePath: "/admin/dashboard"
    })

    if (firebaseConfigLoading || !firebaseApp) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <SnackbarProvider>
            <ModeControllerProvider value={modeController}>
                <FireCMS
                    navigationController={navigationController}
                    authController={authController}
                    dataSourceDelegate={firestoreDelegate}
                    storageSource={storageSource}
                >
                    {({loading}) => {
                        // Applique le mode au document
                        if (typeof document !== 'undefined') {
                            if (modeController.mode === 'dark') {
                                document.documentElement.classList.add('dark')
                            } else {
                                document.documentElement.classList.remove('dark')
                            }
                        }

                        if (loading) {
                            return (
                                <div className="min-h-screen flex items-center justify-center">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            )
                        }

                        if (!authController.user) {
                            return (
                                <FirebaseLoginView
                                    authController={authController}
                                    firebaseApp={firebaseApp}
                                    signInOptions={["password"]}
                                />
                            )
                        }

                        return (
                            <Scaffold>
                                <AppBar title="Qreta Admin"/>
                                <Drawer/>
                                <NavigationRoutes/>
                                <SideDialogs/>
                            </Scaffold>
                        )
                    }}
                </FireCMS>
            </ModeControllerProvider>
        </SnackbarProvider>
    )
}