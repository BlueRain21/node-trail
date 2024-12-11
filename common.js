




const controllerTryCatch =async (callback, res) => {
  try {
    await callback();
  } catch (error) {
    res.status(500).json({
        message: error.message,
        success: false
    })
  }
};


export default controllerTryCatch;