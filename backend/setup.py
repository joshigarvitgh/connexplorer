from setuptools import setup, find_packages

setup(name='conview_backend',
      version='0.2',
      description='A specialized nifti viewer',
      author='Felix Knorr',
      author_email='knorr.felix@gmx.de',
      url='knorrfg.github.io',
      package_data={
        'conview_backend.data': ['*']
      },
      packages=["conview_backend", "conview_backend.data"],
      install_requires=[
        "numpy", "nibabel", "pytest", 
          "nilearn", "click", "pyparadigm>=1.0.10",
          "matplotlib"
      ],
      entry_points={
          'console_scripts':[
              "backend = conview_backend.main:cli",
              "backend_test = conview_backend.test:main"
              ]
          },
      license='MIT')
